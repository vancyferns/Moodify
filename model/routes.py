# routes.py

from flask import request, jsonify
from deepface import DeepFace
import tempfile
import os
from flask_cors import CORS
import cv2
from __init__ import app, db  # ensure this points to app/__init__.py

CORS(app)

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
        # ✅ Extract the first good frame using OpenCV
        cap = cv2.VideoCapture(video_path)
        success, frame = cap.read()
        if not success:
            raise Exception("Could not read frame from video.")

        # ✅ Pass the frame to DeepFace
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)

        # ✅ Parse result
        dominant_emotion = result[0]['dominant_emotion']
        confidence = result[0]['emotion'][dominant_emotion]

        cap.release()
    except Exception as e:
        if os.path.exists(video_path):
            os.unlink(video_path)
        return jsonify({"error": str(e)}), 500

    if os.path.exists(video_path):
        os.unlink(video_path)

    # ✅ Fetch matching songs from MongoDB
    songs = list(db.songs_by_emotion.find({"emotion": dominant_emotion}))
    for song in songs:
        song['_id'] = str(song['_id'])

    return jsonify({
        "emotion": dominant_emotion,
        "confidence": confidence,
        "songs": songs
    }), 200

@app.route('/api/songs/<emotion>', methods=['GET'])
def get_songs_by_emotion(emotion):
    # ✅ Use correct collection name
    songs = list(db.songs_by_emotion.find({"emotion": emotion}))
    for song in songs:
        song['_id'] = str(song['_id'])  # Convert ObjectId to string

    return jsonify({"emotion": emotion, "songs": songs}), 200
