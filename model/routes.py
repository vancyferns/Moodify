from flask import request, jsonify
from deepface import DeepFace
import tempfile
import os
import cv2
import numpy as np
from __init__ import app, db
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
from bson.objectid import ObjectId

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

@app.route("/api/songs", methods=["POST"])
def add_song():
    try:
        # Get data with correct keys from the frontend form
        song_mood = request.form.get("song_mood")
        song_name = request.form.get("song_name")
        song_artist = request.form.get("song_artist")

        song_file = request.files.get("song_file")
        song_image = request.files.get("song_image")

        # Basic validation
        if not all([song_mood, song_name, song_artist, song_file, song_image]):
            return jsonify({"error": "All fields are required"}), 400

        # Upload song to Cloudinary (audio/video type)
        song_upload = cloudinary.uploader.upload(
            song_file,
            resource_type="video",
            folder="songs"
        )

        # Upload image to Cloudinary
        image_upload = cloudinary.uploader.upload(
            song_image,
            folder="song_images"
        )

        song_data = {
            "emotion": song_mood,
            "song_title": song_name,
            "artist": song_artist,
            "song_uri": song_upload["secure_url"],
            "song_image": image_upload["secure_url"]
        }

        # Insert into MongoDB
        db.songs_by_emotion.insert_one(song_data)
        
        # Add the created_at timestamp to match the frontend display
        song_data['_id'] = str(song_data['_id'])

        return jsonify(song_data), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/songs', methods=['GET'])
def get_all_songs():
    try:
        songs = list(db.songs_by_emotion.find({}))
        for song in songs:
            song['_id'] = str(song['_id'])
    
        return jsonify(songs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@app.route('/api/songs/<id>', methods=['DELETE'])
def delete_song(id):
    try:
        # Check if the ID is a valid ObjectId
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid song ID"}), 400

        result = db.songs_by_emotion.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 1:
            return jsonify({"message": "Song deleted successfully"}), 200
        else:
            return jsonify({"error": "Song not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500