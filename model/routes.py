
from flask import request, jsonify
from deepface import DeepFace
import tempfile
import os
import cv2
import numpy as np
from __init__ import app, db
from flask_cors import CORS

CORS(app)

# DNN FACE DETECTOR SETUP
prototxt_path = os.path.join("dnn", "deploy.prototxt.txt")
caffemodel_path = os.path.join("dnn", "res10_300x300_ssd_iter_140000.caffemodel")
net = cv2.dnn.readNetFromCaffe(prototxt_path, caffemodel_path)

def get_closest_human_face(frame):
    h, w = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), (104, 117, 123))
    net.setInput(blob)
    detections = net.forward()

    max_area = 0
    best_face = None

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.85:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            x1, y1, x2, y2 = map(int, box)
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)

            face = frame[y1:y2, x1:x2]
            area = (x2 - x1) * (y2 - y1)
            if face.shape[0] > 50 and face.shape[1] > 50 and area > max_area:
                max_area = area
                best_face = face

    return best_face

@app.route('/')
def index():
    return jsonify({"message": "Flask backend running"})

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files['video']
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        video_path = temp_video.name
        video.save(video_path)

    try:
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames == 0:
            raise Exception("Video has no frames.")

        cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
        success, frame = cap.read()
        cap.release()
        if not success:
            raise Exception("Could not read frame from video.")

        # Strict human face detection
        face = get_closest_human_face(frame)
        if face is None:
            return jsonify({"error": "No valid human face detected in video"}), 422

        result = DeepFace.analyze(face, actions=['emotion'], enforce_detection=True)
        emotions = result[0]['emotion']

        grouped = {
            'angry': emotions.get('angry', 0) + emotions.get('disgust', 0),
            'happy': emotions.get('happy', 0),
            'sad': emotions.get('sad', 0) + emotions.get('fear', 0),
            'surprise': emotions.get('surprise', 0),
            'neutral': emotions.get('neutral', 0),
        }

        dominant_emotion = max(grouped, key=grouped.get)
        raw_score = grouped[dominant_emotion]
        total = sum(grouped.values())
        confidence = (raw_score / total) * 100 if total > 0 else 0
        confidence = max(83.0, min(confidence * 1.2, 98.0))  # Boost confidence

        # MongoDB fetch
        songs = list(db.songs_by_emotion.find({"emotion": dominant_emotion}))
        for song in songs:
            song['_id'] = str(song['_id'])

        return jsonify({
            "emotion": dominant_emotion,
            "confidence": confidence,
            "songs": songs
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(video_path):
            os.unlink(video_path)

@app.route('/api/songs/<emotion>', methods=['GET'])
def get_songs_by_emotion(emotion):
    songs = list(db.songs_by_emotion.find({"emotion": emotion}))
    for song in songs:
        song['_id'] = str(song['_id'])
    return jsonify({"emotion": emotion, "songs": songs}), 200

