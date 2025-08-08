# emotion_detection.py

import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import torch
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import sent_tokenize, word_tokenize
import logging
import numpy as np
from collections import Counter
import string
from pymongo import MongoClient
# ---------------------------
# MongoDB Atlas Connection
# ---------------------------
MONGO_URI = "mongodb+srv://soniyavitkar2712:soniya_27@cluster0.slai2ew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["moodify_db"]
songs_collection = db["songs_by_emotion"]

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# --- Model & Configuration ---
emotion_classifier = None
device = "cuda" if torch.cuda.is_available() else "cpu"

# Define the emotions allowed in the final output and map model labels to them
# We intentionally exclude 'fear' and 'disgust' from this mapping.
EMOTION_MAP = {
    'joy': 'happy',
    'sadness': 'sad',
    'anger': 'angry',
    'neutral': 'neutral',
    'surprise': 'surprise'
}

def initialize_model():
    """Initializes the pre-trained emotion classification model."""
    global emotion_classifier
    try:
        model_name = "j-hartmann/emotion-english-distilroberta-base"
        logger.info(f"Loading model: {model_name} on device: {device}")
        
        emotion_classifier = pipeline(
            "text-classification",
            model=model_name,
            tokenizer=model_name,
            device=0 if device == "cuda" else -1,
            return_all_scores=True,
            max_length=512,
            truncation=True
        )
        logger.info("Model loaded successfully!")
        return True
    except Exception as e:
        logger.error(f"Fatal error loading model: {e}")
        emotion_classifier = None
        return False

def combine_responses(responses):
    """A simple function to combine multiple text inputs into one."""
    if not responses:
        return ""
    
    valid_responses = [resp.strip() for resp in responses if resp and resp.strip()]
    combined_text = " . ".join(valid_responses)
    
    # Simple truncation to prevent excessively long inputs
    words = combined_text.split()
    if len(words) > 400:
        combined_text = " ".join(words[:400])
        
    return combined_text

# --- API Endpoints ---
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify model status."""
    return jsonify({
        'status': 'healthy',
        'model_status': "loaded" if emotion_classifier else "not loaded",
        'device': device
    })

@app.route('/text_emotion/predict', methods=['POST'])
def predict_emotion():
    """
    Predicts a single, primary emotion from the allowed set.
    This endpoint does not support mixed emotions.
    """
    if not emotion_classifier:
        return jsonify({'error': 'Model is not available. Please try again later.'}), 503

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided in the request.'}), 400

        # Combine multiple questionnaire responses into a single text
        if 'responses' in data:
            text = combine_responses(data.get('responses', []))
        else:
            return jsonify({
                'error': 'Invalid input. Provide either "text" or "responses" field'
            }), 400

        if not text or not text.strip():
            return jsonify({'error': 'Text is empty after processing'}), 400

        # Use enhanced ensemble prediction
        use_ensemble = data.get('use_ensemble', True)
        
        if use_ensemble:
            results = ensemble_prediction_enhanced(text)
        else:
            processed_text = preprocess_text_minimal(text)
            results = emotion_classifier(processed_text)
        
        if not results:
            return jsonify({'error': 'Failed to get emotion predictions'}), 500

        # Get enhanced keyword analysis
        keyword_emotions, context_info = analyze_emotion_keywords_enhanced(text)
        
        # Process results with contextual boosting
        emotions_with_scores = []
        primary_emotion = None
        max_score = 0
        
        for result in results[0]:
            emotion = result['label'].lower()
            score = result['score']
            
            # Apply contextual boosting
            if emotion in keyword_emotions:
                # More sophisticated boosting based on context
                keyword_boost = min(keyword_emotions[emotion] * 0.08, 0.25)  # Max 25% boost
                
                # Additional boost for achievement context in joy/happiness
                if emotion in ['joy', 'happiness'] and context_info['has_achievement']:
                    keyword_boost += 0.15  # Strong boost for achievements
                
                # Additional boost for future positive events
                if emotion in ['joy', 'happiness'] and context_info['has_future_positive']:
                    keyword_boost += 0.10
                
                score = min(score + keyword_boost, 1.0)
            
            emotions_with_scores.append({
                'emotion': emotion,
                'confidence': round(score, 4)
            })
            
            if score > max_score:
                max_score = score
                primary_emotion = emotion

        # Sort by confidence score
        emotions_with_scores.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Calculate confidence adjustment
        confidence_adjustment = 1.0
        word_count = len(text.split())
        
        # Adjust confidence based on text richness and context
        if word_count < 5:
            confidence_adjustment = 0.7
        elif word_count > 50:
            confidence_adjustment = 1.1
        
        # Boost confidence if we have strong contextual indicators
        if context_info['has_achievement'] or context_info['has_future_positive']:
            confidence_adjustment += 0.1
        
        if context_info['intensity_count'] > 2:
            confidence_adjustment += 0.05
        
        final_confidence = min(max_score * confidence_adjustment, 1.0)
        
        return jsonify({
            'primary_emotion': primary_emotion,
            'confidence': round(final_confidence, 4),
            'all_emotions': emotions_with_scores,
            'keyword_matches': keyword_emotions,
            'context_analysis': {
                'has_achievement_context': context_info['has_achievement'],
                'has_future_positive_events': context_info['has_future_positive'],
                'intensity_modifiers': context_info['intensity_count'],
                'achievement_phrases': context_info.get('achievement_matches', [])
            },
            'text_analysis': {
                'word_count': word_count,
                'confidence_adjustment': round(confidence_adjustment, 2),
                'ensemble_used': use_ensemble
            },
            'original_text_preview': text[:150] + ('...' if len(text) > 150 else '')
        })

    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/test', methods=['POST'])
def test_emotion():
    """Test endpoint for debugging emotion detection"""
    if not emotion_classifier:
        return jsonify({'error': 'Model is not loaded'}), 500
    
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text to analyze after processing responses.'}), 400

        # Get raw predictions from the underlying model
        raw_predictions = emotion_classifier(text)

        # 1. Filter the raw predictions to only include emotions we want to use.
        relevant_predictions = []
        for pred in raw_predictions[0]:
            if pred['label'].lower() in EMOTION_MAP:
                relevant_predictions.append(pred)

        if not relevant_predictions:
            # This case is unlikely but handled for safety
            return jsonify({'error': 'Could not determine a valid emotion.'}), 500

        # 2. Re-normalize scores so they sum to 1, showing their relative strength.
        total_score_of_relevant = sum(p['score'] for p in relevant_predictions)
        
        final_emotions = []
        if total_score_of_relevant > 0:
            for pred in relevant_predictions:
                normalized_confidence = pred['score'] / total_score_of_relevant
                mapped_emotion = EMOTION_MAP.get(pred['label'].lower())
                
                if mapped_emotion:
                    final_emotions.append({
                        'emotion': mapped_emotion,
                        'confidence': round(normalized_confidence, 4)
                    })

        # 3. Sort by the new confidence to find the single primary emotion.
        final_emotions.sort(key=lambda x: x['confidence'], reverse=True)
        
        primary_emotion_obj = final_emotions[0]

        # 4. Return the result in the format expected by the frontend.
        return jsonify({
            'primary_emotion': primary_emotion_obj['emotion'],
            'confidence': primary_emotion_obj['confidence'],
            'all_emotions': final_emotions,
            'keyword_matches': {} # Included for frontend compatibility
        })

    except Exception as e:
        logger.error(f"An unexpected error occurred during prediction: {e}")
        return jsonify({'error': f'A server error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("Starting Emotion Detection API...")
    if initialize_model():
        app.run(debug=True, host='0.0.0.0', port=5001)
    else:
        logger.error("Could not start the server because the model failed to initialize.")