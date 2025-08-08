# Enhanced emotion_detection.py with improved contextual analysis

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
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

# Global variables for the model
emotion_classifier = None
device = "cuda" if torch.cuda.is_available() else "cpu"

def initialize_model():
    """Initialize the pretrained emotion classification model with better configuration"""
    global emotion_classifier
    try:
        # Using a popular pretrained emotion classification model
        model_name = "j-hartmann/emotion-english-distilroberta-base"
        
        logger.info(f"Loading model: {model_name}")
        logger.info(f"Using device: {device}")
        
        # Initialize the pipeline with better configuration
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
        logger.error(f"Error loading model: {e}")
        emotion_classifier = None
        return False

# Initialize NLTK components
try:
    nltk.data.find('corpora/stopwords.zip')
    nltk.data.find('tokenizers/punkt.zip')
    stop_words = set(stopwords.words('english'))
    stemmer = PorterStemmer()
except:
    try:
        nltk.download('stopwords')
        nltk.download('punkt')
        stop_words = set(stopwords.words('english'))
        stemmer = PorterStemmer()
    except:
        stop_words = set()
        stemmer = None
        logger.warning("NLTK components not available")

# Enhanced contractions dictionary
contractions_dict = {
    "ain't": "am not", "aren't": "are not", "can't": "cannot", "can't've": "cannot have", "'cause": "because",
    "could've": "could have", "couldn't": "could not", "couldn't've": "could not have", "didn't": "did not",
    "doesn't": "does not", "don't": "do not", "hadn't": "had not", "hadn't've": "had not have", "hasn't": "has not",
    "haven't": "have not", "he'd": "he would", "he'd've": "he would have", "he'll": "he will", "he'll've": "he will have",
    "he's": "he is", "how'd": "how did", "how'd'y": "how do you", "how'll": "how will", "how's": "how is",
    "I'd": "I would", "I'd've": "I would have", "I'll": "I will", "I'll've": "I will have", "I'm": "I am",
    "I've": "I have", "isn't": "is not", "it'd": "it would", "it'd've": "it would have", "it'll": "it will",
    "it'll've": "it will have", "it's": "it is", "let's": "let us", "ma'am": "madam", "mayn't": "may not",
    "might've": "might have", "mightn't": "might not", "mightn't've": "might not have", "must've": "must have",
    "mustn't": "must not", "mustn't've": "must not have", "needn't": "need not", "needn't've": "need not have",
    "o'clock": "of the clock", "oughtn't": "ought not", "oughtn't've": "ought not have", "shan't": "shall not",
    "sha'n't": "shall not", "shan't've": "shall not have", "she'd": "she would", "she'd've": "she would have",
    "she'll": "she will", "she'll've": "she will have", "she's": "she is", "should've": "should have",
    "shouldn't": "should not", "shouldn't've": "should not have", "so've": "so have", "so's": "so is",
    "that'd": "that would", "that'd've": "that would have", "that's": "that is", "there'd": "there would",
    "there'd've": "there would have", "there's": "there is", "they'd": "they would", "they'd've": "they would have",
    "they'll": "they will", "they'll've": "they will have", "they're": "they are", "they've": "they have",
    "to've": "to have", "wasn't": "was not", "we'd": "we would", "we'd've": "we would have", "we'll": "we will",
    "we'll've": "we will have", "we're": "we are", "we've": "we have", "weren't": "were not", "what'll": "what will",
    "what'll've": "what will have", "what're": "what are", "what's": "what is", "what've": "what have",
    "when's": "when is", "when've": "when have", "where'd": "where did", "where's": "where is", "where've": "where have",
    "who'll": "who will", "who'll've": "who will have", "who's": "who is", "who've": "who have", "why's": "why is",
    "why've": "why have", "will've": "will have", "won't": "will not", "won't've": "will not have",
    "would've": "would have", "wouldn't": "would not", "wouldn't've": "would not have", "y'all": "you all",
    "y'all'd": "you all would", "y'all'd've": "you all would have", "y'all're": "you all are", "y'all've": "you all have",
    "you'd": "you would", "you'd've": "you would have", "you'll": "you will", "you'll've": "you will have",
    "you're": "you are", "you've": "you have"
}

# Enhanced emotion keywords with contextual phrases and achievements
emotion_keywords = {
    'joy': {
        'direct': ['happy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'thrilled', 
                  'delighted', 'cheerful', 'elated', 'blissful', 'joyful', 'proud', 'accomplished', 'pleased', 
                  'successful', 'celebration', 'celebrate', 'achievement', 'victory', 'triumph', 'blessed'],
        'contextual': ['huge success', 'really pleased', 'looking forward', 'incredibly proud', 'went well', 
                      'turned out great', 'exceeded expectations', 'dream come true', 'over the moon', 
                      'on cloud nine', 'feeling good', 'positive outcome', 'breakthrough', 'milestone']
    },
    'sadness': {
        'direct': ['sad', 'down', 'depressed', 'upset', 'crying', 'hurt', 'disappointed', 'lonely', 'miserable', 
                  'heartbroken', 'gloomy', 'melancholy', 'devastated', 'crushed', 'broken'],
        'contextual': ['let down', 'fell through', 'didn\'t work out', 'lost hope', 'feeling empty', 
                      'going through tough time', 'struggling with', 'hit rock bottom', 'world falling apart']
    },
    'anger': {
        'direct': ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'outraged', 'livid', 
                  'enraged', 'bitter', 'resentful', 'pissed', 'infuriated'],
        'contextual': ['can\'t stand', 'fed up with', 'had enough', 'boiling point', 'losing patience', 
                      'makes my blood boil', 'driving me crazy', 'at my wit\'s end']
    },
    'fear': {
        'direct': ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'terrified', 'frightened', 'panicked', 
                  'concerned', 'uneasy', 'apprehensive', 'stressed', 'overwhelmed'],
        'contextual': ['having second thoughts', 'losing sleep over', 'on edge', 'walking on eggshells', 
                      'butterflies in stomach', 'sweating bullets', 'heart racing', 'worst case scenario']
    },
    'surprise': {
        'direct': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'bewildered', 'unexpected', 
                  'sudden', 'startled', 'blown away', 'mind-blown'],
        'contextual': ['out of nowhere', 'didn\'t see coming', 'caught off guard', 'plot twist', 
                      'never expected', 'came as shock', 'totally unexpected']
    },
    'disgust': {
        'direct': ['disgusted', 'revolted', 'sick', 'nauseated', 'repulsed', 'appalled', 'grossed out', 'repelled'],
        'contextual': ['makes me sick', 'can\'t stomach', 'turns my stomach', 'absolutely appalling']
    }
}

contractions_re = re.compile('(%s)' % '|'.join(contractions_dict.keys()))

def expand_contractions(text, contractions_dict=contractions_dict):
    """Expand contractions in text"""
    def replace(match):
        return contractions_dict[match.group(0)]
    return contractions_re.sub(replace, text)

def extract_achievement_context(text):
    """Extract achievement and success-related context that indicates positive emotions"""
    achievement_patterns = [
        r'(project|work|assignment|task|job).{0,20}(success|successful|well|great|amazing|pleased)',
        r'(boss|manager|supervisor|teacher).{0,20}(pleased|happy|impressed|proud|satisfied)',
        r'(accomplish|achieve|complete|finish|succeed).{0,20}(successfully|well|great)',
        r'(promotion|raise|award|recognition|praise|compliment)',
        r'(celebration|celebrate|party|reward|treat)',
        r'(milestone|breakthrough|achievement|victory|triumph|win)',
        r'(exceeded|surpassed|better than expected|beyond expectations)'
    ]
    
    matches = []
    text_lower = text.lower()
    
    for pattern in achievement_patterns:
        found = re.findall(pattern, text_lower)
        matches.extend(found)
    
    return len(matches) > 0, matches

def extract_contextual_emotion_cues(text):
    """Extract contextual emotional cues from text"""
    text_lower = text.lower()
    
    # Check for achievement context
    has_achievement, achievement_matches = extract_achievement_context(text)
    
    # Check for future positive events
    future_positive_patterns = [
        r'(looking forward|excited about|can\'t wait|anticipating).{0,30}(weekend|party|celebration|event|trip|vacation|holiday)',
        r'(planning|going to).{0,20}(celebrate|party|enjoy|have fun)'
    ]
    
    has_future_positive = any(re.search(pattern, text_lower) for pattern in future_positive_patterns)
    
    # Check for intensity modifiers
    intensity_modifiers = ['really', 'incredibly', 'extremely', 'very', 'super', 'absolutely', 'totally', 'completely', 'hugely']
    intensity_count = sum(1 for modifier in intensity_modifiers if modifier in text_lower)
    
    return {
        'has_achievement': has_achievement,
        'achievement_matches': achievement_matches,
        'has_future_positive': has_future_positive,
        'intensity_count': intensity_count
    }

def analyze_emotion_keywords_enhanced(text):
    """Enhanced emotional keyword analysis with contextual understanding"""
    text_lower = text.lower()
    emotion_scores = {}
    
    # Get contextual cues
    context = extract_contextual_emotion_cues(text)
    
    # Analyze keywords with context
    for emotion, keyword_types in emotion_keywords.items():
        score = 0
        
        # Direct keywords
        for keyword in keyword_types['direct']:
            count = text_lower.count(keyword)
            score += count
        
        # Contextual phrases (weighted higher)
        for phrase in keyword_types['contextual']:
            if phrase in text_lower:
                score += 2  # Contextual phrases get double weight
        
        # Apply contextual bonuses
        if emotion == 'joy':
            if context['has_achievement']:
                score += 3  # Strong boost for achievements
            if context['has_future_positive']:
                score += 2  # Boost for positive future events
            score += context['intensity_count'] * 0.5  # Boost for intensity modifiers
        
        if score > 0:
            emotion_scores[emotion] = score
    
    return emotion_scores, context

def enhance_text_with_context(text):
    """Add contextual markers to help the model understand emotional intensity"""
    # Preserve original emotional context
    enhanced_text = text
    
    # Add emphasis markers for caps (but don't change the original much)
    enhanced_text = re.sub(r'\b[A-Z]{2,}\b', lambda m: f"{m.group().lower()}", enhanced_text)
    
    # Handle repeated punctuation as intensity markers
    enhanced_text = re.sub(r'[!]{2,}', '! (very excited)', enhanced_text)
    enhanced_text = re.sub(r'[?]{2,}', '? (very confused)', enhanced_text)
    enhanced_text = re.sub(r'[.]{3,}', '... (hesitant)', enhanced_text)
    
    return enhanced_text

def preprocess_text_minimal(text):
    """Minimal preprocessing that preserves emotional context"""
    if not text or not text.strip():
        return ""
    
    # Very light preprocessing to preserve context
    text = expand_contractions(text)
    
    # Only clean up obvious issues
    text = re.sub(r'\s+', ' ', text)  # Multiple spaces to single space
    text = text.strip()
    
    return text

def combine_responses_intelligently(responses):
    """Intelligently combine multiple responses preserving emotional context"""
    if not responses:
        return ""
    
    # Filter out empty responses
    valid_responses = [resp.strip() for resp in responses if resp.strip()]
    
    if not valid_responses:
        return ""
    
    # For emotion detection, we want to preserve the full context
    # So we'll combine with natural separators
    combined = " . ".join(valid_responses)
    
    # Ensure we don't exceed model limits (approx 400 words to stay safe)
    words = combined.split()
    if len(words) > 400:
        combined = " ".join(words[:400])
    
    return combined

def ensemble_prediction_enhanced(text, num_variations=3):
    """Enhanced ensemble prediction with better text handling"""
    variations = []
    
    # Original text (lightly processed)
    variations.append(preprocess_text_minimal(text))
    
    # Enhanced version with context markers
    variations.append(enhance_text_with_context(preprocess_text_minimal(text)))
    
    # Sentence-focused version for longer texts
    if len(text.split()) > 30:
        sentences = sent_tokenize(text)
        if len(sentences) > 1:
            # Focus on most emotionally rich sentences
            emotional_sentences = []
            for sentence in sentences:
                keyword_score, _ = analyze_emotion_keywords_enhanced(sentence)
                if sum(keyword_score.values()) > 0:
                    emotional_sentences.append(sentence)
            
            if emotional_sentences:
                variations.append(preprocess_text_minimal(" . ".join(emotional_sentences)))
    
    # Get predictions for all variations
    all_predictions = []
    for variation in variations[:num_variations]:
        if variation.strip():
            try:
                pred = emotion_classifier(variation)
                all_predictions.append(pred[0])
            except Exception as e:
                logger.warning(f"Prediction failed for variation: {e}")
                continue
    
    if not all_predictions:
        return None
    
    # Aggregate predictions with weighted average
    emotion_totals = {}
    weights = [1.0, 1.2, 0.8]  # Give slight preference to context-enhanced version
    
    for i, prediction in enumerate(all_predictions):
        weight = weights[i] if i < len(weights) else 1.0
        for result in prediction:
            emotion = result['label'].lower()
            score = result['score'] * weight
            emotion_totals[emotion] = emotion_totals.get(emotion, 0) + score
    
    # Average the scores
    total_weight = sum(weights[:len(all_predictions)])
    final_scores = []
    
    for emotion, total_score in emotion_totals.items():
        avg_score = total_score / total_weight
        final_scores.append({
            'label': emotion,
            'score': avg_score
        })
    
    return [final_scores]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    model_status = "loaded" if emotion_classifier else "not loaded"
    return jsonify({
        'status': 'healthy',
        'model_status': model_status,
        'device': device
    })

@app.route('/text_emotion/predict', methods=['POST'])
def predict_emotion():
    """Enhanced emotion prediction with better contextual understanding"""
    if not emotion_classifier:
        return jsonify({
            'error': 'Model is not loaded. Please restart the server.'
        }), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Handle both single text and multiple responses
        if 'text' in data:
            text = data['text']
            if not text or not text.strip():
                return jsonify({'error': 'Empty text provided'}), 400
            
        elif 'responses' in data:
            responses = data['responses']
            if not responses or not any(resp.strip() for resp in responses):
                return jsonify({'error': 'No valid responses provided'}), 400
            
            # Use intelligent combination
            text = combine_responses_intelligently(responses)
            
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
                keyword_boost = min(keyword_emotions[emotion] * 0.08, 0.25)
                
                if emotion in ['joy', 'happiness'] and context_info['has_achievement']:
                    keyword_boost += 0.15
                
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

        emotions_with_scores.sort(key=lambda x: x['confidence'], reverse=True)
        
        confidence_adjustment = 1.0
        word_count = len(text.split())
        
        if word_count < 5:
            confidence_adjustment = 0.7
        elif word_count > 50:
            confidence_adjustment = 1.1
        
        if context_info['has_achievement'] or context_info['has_future_positive']:
            confidence_adjustment += 0.1
        
        if context_info['intensity_count'] > 2:
            confidence_adjustment += 0.05
        
        final_confidence = min(max_score * confidence_adjustment, 1.0)

        # ⭐⭐ NEW CODE: Fetch songs from MongoDB ⭐⭐
        songs = list(songs_collection.find({"emotion": primary_emotion}))

        song_list = []
        for song in songs:
            song_list.append({
                "title": song["title"],
                "artist": song["artist"],
                "url": song["url"],
                "cover": song["cover"]
            })

        # ✅ Return response
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
            'original_text_preview': text[:150] + ('...' if len(text) > 150 else ''),
            'songs': song_list    # 👈 ADDED songs list
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
            return jsonify({'error': 'No text provided'}), 400
        
        # Analyze with different approaches
        results = {}
        
        # Raw model prediction
        raw_result = emotion_classifier(text)
        results['raw_model'] = raw_result[0]
        
        # Enhanced keyword analysis
        keyword_emotions, context = analyze_emotion_keywords_enhanced(text)
        results['keyword_analysis'] = keyword_emotions
        results['context_analysis'] = context
        
        # Ensemble prediction
        ensemble_result = ensemble_prediction_enhanced(text)
        if ensemble_result:
            results['ensemble_prediction'] = ensemble_result[0]
        
        return jsonify({
            'input_text': text,
            'analysis_results': results,
            'recommendations': {
                'detected_patterns': list(context.keys()),
                'keyword_matches': list(keyword_emotions.keys()),
                'confidence_factors': [
                    f"Text length: {len(text.split())} words",
                    f"Achievement context: {context['has_achievement']}",
                    f"Future positive: {context['has_future_positive']}",
                    f"Intensity modifiers: {context['intensity_count']}"
                ]
            }
        })
        
    except Exception as e:
        logger.error(f"Error in test endpoint: {e}")
        return jsonify({'error': str(e)}), 500

# Keep the existing detailed analysis and model info endpoints...
@app.route('/emotions/analyze', methods=['POST'])
def analyze_detailed():
    """Detailed emotion analysis with sentence-level breakdown"""
    if not emotion_classifier:
        return jsonify({
            'error': 'Model is not loaded. Please restart the server.'
        }), 500

    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Text field is required'}), 400

        text = data['text']
        if not text or not text.strip():
            return jsonify({'error': 'Empty text provided'}), 400

        # Analyze overall emotion with enhanced method
        overall_results = ensemble_prediction_enhanced(text)
        if not overall_results:
            overall_results = emotion_classifier(preprocess_text_minimal(text))
        
        # Sentence-level analysis
        sentences = sent_tokenize(text)
        sentence_emotions = []
        
        for i, sentence in enumerate(sentences):
            if len(sentence.strip()) > 5:
                try:
                    sentence_result = emotion_classifier(preprocess_text_minimal(sentence))
                    
                    top_emotion = max(sentence_result[0], key=lambda x: x['score'])
                    sentence_emotions.append({
                        'sentence_index': i,
                        'sentence': sentence[:100] + ('...' if len(sentence) > 100 else ''),
                        'emotion': top_emotion['label'].lower(),
                        'confidence': round(top_emotion['score'], 4)
                    })
                except:
                    continue

        # Overall emotion processing
        primary_emotion = max(overall_results[0], key=lambda x: x['score'])
        all_emotions = sorted(
            [{'emotion': r['label'].lower(), 'confidence': round(r['score'], 4)} 
             for r in overall_results[0]], 
            key=lambda x: x['confidence'], reverse=True
        )

        return jsonify({
            'overall_emotion': {
                'primary_emotion': primary_emotion['label'].lower(),
                'confidence': round(primary_emotion['score'], 4),
                'all_emotions': all_emotions
            },
            'sentence_analysis': sentence_emotions,
            'text_statistics': {
                'total_sentences': len(sentences),
                'analyzed_sentences': len(sentence_emotions),
                'word_count': len(text.split()),
                'character_count': len(text)
            }
        })

    except Exception as e:
        logger.error(f"Error in detailed analysis: {e}")
        return jsonify({
            'error': f'Analysis failed: {str(e)}'
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if not emotion_classifier:
        return jsonify({
            'error': 'Model is not loaded'
        }), 500
    
    return jsonify({
        'model_name': 'j-hartmann/emotion-english-distilroberta-base',
        'model_type': 'DistilRoBERTa',
        'supported_emotions': [
            'anger', 'disgust', 'fear', 'joy', 'neutral', 'sadness', 'surprise'
        ],
        'device': device,
        'status': 'loaded',
        'enhancements': [
            'Enhanced contextual analysis',
            'Achievement pattern recognition',
            'Future event sentiment detection',
            'Intensity modifier analysis',
            'Ensemble prediction with multiple text variations',
            'Sophisticated keyword boosting',
            'Minimal preprocessing to preserve context'
        ]
    })

if __name__ == '__main__':
    logger.info("Starting Enhanced Emotion Detection API...")
    
    if initialize_model():
        logger.info("Model initialized successfully. Starting server...")
        app.run(debug=True, host='0.0.0.0', port=5001)
    else:
        logger.error("Failed to initialize model. Please check your internet connection and try again.")
        print("\nTo install required dependencies, run:")
        print("pip install torch transformers flask flask-cors nltk numpy")