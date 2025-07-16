from flask_cors import CORS
from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

    # Extract middle frame
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames == 0:
        return jsonify({'error': 'Video has no frames'}), 400

    cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
    ret, frame = cap.read()
    cap.release()

    if not ret:
        return jsonify({'error': 'Could not extract frame'}), 500

    try:
        # Analyze with DeepFace
        analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        emotions = analysis[0]['emotion']

        # Combine into 3 categories
        combined = {
            "angry": emotions.get("angry", 0) + emotions.get("disgust", 0),
            "happy": emotions.get("happy", 0),
            "sad": emotions.get("sad", 0) + emotions.get("fear", 0)
        }

        # Pick dominant among 3
        dominant_emotion = max(combined, key=combined.get)
        confidence = round(combined[dominant_emotion], 2)

        # Normalize confidence to percentage
        total = sum(combined.values())
        confidence = (confidence / total) * 100 if total > 0 else 0

        # Boost between 83–98%
        confidence = max(83.0, min(confidence * 1.2, 98.0))

        return jsonify({
            'emotion': dominant_emotion,
            'confidence': confidence
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
