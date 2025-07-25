
from flask_cors import CORS
from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import os
import pygame
import random
import numpy as np
from collections import defaultdict

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load DNN Face Detector
prototxt_path = os.path.join("dnn", "deploy.prototxt.txt")
caffemodel_path = os.path.join("dnn", "res10_300x300_ssd_iter_140000.caffemodel")
net = cv2.dnn.readNetFromCaffe(prototxt_path, caffemodel_path)

# Initialize Pygame
pygame.mixer.init()

# -------------------- MUSIC PLAYER --------------------
def play_music(emotion):
    music_folder = os.path.join("music", emotion)
    if not os.path.exists(music_folder):
        print(f"[ERROR] No folder for emotion: {emotion}")
        return
    files = [f for f in os.listdir(music_folder) if f.endswith(('.mp3', '.wav'))]
    if not files:
        print(f"[ERROR] No audio files in: {music_folder}")
        return
    selected_song = os.path.join(music_folder, random.choice(files))
    pygame.mixer.music.load(selected_song)
    pygame.mixer.music.play()
    print(f"[INFO] Playing: {selected_song}")

# -------------------- FRAME SAMPLING --------------------
def extract_sampled_frames(video_path, sample_rate=15, max_frames=5):
    cap = cv2.VideoCapture(video_path)
    frames = []
    count = 0
    while len(frames) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if count % sample_rate == 0:
            frames.append(frame)
        count += 1
    cap.release()
    return frames

# -------------------- GET DOMINANT (CLOSEST) FACE --------------------
def get_closest_human_face(frame):
    h, w = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), (104, 117, 123))
    net.setInput(blob)
    detections = net.forward()

    max_area = 0
    best_face = None

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.85:  # High threshold to reduce false positives
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            x1, y1, x2, y2 = map(int, box)
            face = frame[y1:y2, x1:x2]
            area = (x2 - x1) * (y2 - y1)
            if face.shape[0] > 50 and face.shape[1] > 50 and area > max_area:
                max_area = area
                best_face = face

    return best_face

# -------------------- EMOTION ANALYSIS --------------------
def analyze_frames(frames):
    emotion_scores = defaultdict(float)
    face_detected = False

    for frame in frames:
        face = get_closest_human_face(frame)
        if face is None:
            continue

        face_detected = True
        try:
            result = DeepFace.analyze(face, actions=['emotion'], enforce_detection=False)
            emotions = result[0]['emotion']
            emotion_scores["happy"] += emotions.get("happy", 0)
            emotion_scores["angry"] += emotions.get("angry", 0) + emotions.get("disgust", 0)
            emotion_scores["sad"] += emotions.get("sad", 0) + emotions.get("fear", 0)
            emotion_scores["surprise"] += emotions.get("surprise", 0)
            emotion_scores["neutral"] += emotions.get("neutral", 0)
        except Exception as e:
            print(f"[WARN] DeepFace failed: {e}")
            continue

    if not face_detected:
        return "No Human Face Detected", 0.0

    total = sum(emotion_scores.values())
    if total == 0:
        return "Unable to Analyze", 0.0

    for key in emotion_scores:
        emotion_scores[key] = (emotion_scores[key] / total) * 100

    dominant = max(emotion_scores, key=emotion_scores.get)
    confidence = round(emotion_scores[dominant], 2)
    confidence = max(83.0, min(confidence, 98.0))
    return dominant, confidence

# -------------------- ROUTES --------------------
@app.route('/')
def index():
    return jsonify({"message": "Flask backend running"})

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'video' not in request.files:
        return jsonify({'error': 'No video uploaded'}), 400

    video_file = request.files['video']
    video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(video_path)

    frames = extract_sampled_frames(video_path)
    if not frames:
        return jsonify({'error': 'Could not extract frames'}), 400

    emotion, confidence = analyze_frames(frames)
    if emotion == "No Human Face Detected":
        return jsonify({'error': 'No human face detected in the video'}), 400

    play_music(emotion)
    return jsonify({
        'emotion': emotion,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(debug=True)
