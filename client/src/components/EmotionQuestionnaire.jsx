import React, { useState, useMemo } from 'react';

function EmotionQuestionnaire() {
  const questions = [
    "What was the highlight of your day?",
    "What's something that has been on your mind lately?",
    "How are you feeling physically right now?",
    "What are you looking forward to (or not looking forward to)?",
    "If you could describe your current mood in a few words, what would they be?",
    // "Is there anything that's been bothering or exciting you recently?",
    // "How would you rate your energy level and why?"
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [emotionResult, setEmotionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const MIN_ANSWERS_REQUIRED = 3;

  const emotionRoutes = {
    'joy': 'happy-songs',
    'happiness': 'happy-songs',
    'happy': 'happy-songs',
    'sadness': 'sad-songs',
    'sad': 'sad-songs',
    'anger': 'angry-songs',
    'angry': 'angry-songs',
    'fear': 'calm-songs',
    'surprise': 'energetic-songs',
    'disgust': 'calm-songs',
    'neutral': 'chill-songs'
  };

  const answeredQuestionsCount = useMemo(() => {
    return answers.filter(answer => answer.trim() !== '').length;
  }, [answers]);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      'joy': 'text-yellow-300',
      'happiness': 'text-yellow-300',
      'happy': 'text-yellow-300',
      'sadness': 'text-blue-400',
      'sad': 'text-blue-400',
      'anger': 'text-red-500',
      'angry': 'text-red-500',
      'fear': 'text-indigo-400',
      'surprise': 'text-teal-300',
      'disgust': 'text-lime-500',
      'neutral': 'text-gray-400'
    };
    return colors[emotion] || 'text-indigo-400';
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      'joy': '😊',
      'happiness': '😊',
      'happy': '😊',
      'sadness': '😢',
      'sad': '😢',
      'anger': '😠',
      'angry': '😠',
      'fear': '😰',
      'surprise': '😲',
      'disgust': '🤢',
      'neutral': '😐'
    };
    return emojis[emotion] || '🎭';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const handleSubmit = async () => {
    if (answeredQuestionsCount < MIN_ANSWERS_REQUIRED) return;

    const answeredResponses = answers.filter(ans => ans.trim() !== '');
    
    setIsLoading(true);
    setError(null);
    setEmotionResult(null);
    setLoadingMessage('Analyzing your emotions with AI...');

    const apiUrl = 'http://127.0.0.1:5001/predict';
    const payload = {
      responses: answeredResponses,
      use_ensemble: true
    };

    try {
      setTimeout(() => {
        if (isLoading) setLoadingMessage('Processing your emotional patterns...');
      }, 1500);

      setTimeout(() => {
        if (isLoading) setLoadingMessage('Almost done! Finalizing results...');
      }, 3000);

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `API request failed with status ${res.status}`);
      }

      const data = await res.json();
      setEmotionResult(data);

      setTimeout(() => {
        const primaryEmotion = data.primary_emotion.toLowerCase();
        const route = emotionRoutes[primaryEmotion];
        
        if (route) {
          console.log(`Would navigate to: /${route}`, { 
            emotionData: data, 
            userResponses: answeredResponses 
          });
        } else {
          setError(`We detected "${primaryEmotion}" but don't have songs for this emotion yet.`);
        }
      }, 2500);

    } catch (err) {
      console.error("Emotion analysis error:", err);
      setError(err.message || "Sorry, we couldn't analyze your emotions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setAnswers(Array(questions.length).fill(''));
    setEmotionResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans">
      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-blue-500/10 w-full max-w-xl text-center mx-auto my-12 p-8">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600 blur-3xl opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-600 blur-3xl opacity-20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

        {!isLoading && !emotionResult && !error && (
          <div className="relative z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-br from-white to-gray-400 text-transparent bg-clip-text mb-3">
              How Are You Feeling?
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Answer at least <strong>{MIN_ANSWERS_REQUIRED} questions</strong> for an accurate analysis.
            </p>

            <div className="space-y-5 mb-8 text-left">
              {questions.map((q, idx) => (
                <div key={idx} className="group">
                  <label htmlFor={`q-${idx}`} className="block mb-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-300">
                    {q}
                  </label>
                  <textarea
                    id={`q-${idx}`}
                    value={answers[idx]}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-500 resize-none transition-all duration-300"
                    placeholder="Your detailed response helps our AI..."
                    rows="3"
                    disabled={isLoading}
                  />
                  {answers[idx].trim() && (
                    <div className="mt-1 flex items-center text-xs text-blue-400">
                      <span className="mr-1">✓</span>
                      <span>Answered ({answers[idx].split(' ').filter(w => w).length} words)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="w-full bg-white/5 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(answeredQuestionsCount / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-400 mt-2">
                Progress: {answeredQuestionsCount} / {questions.length} answered
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={answeredQuestionsCount < MIN_ANSWERS_REQUIRED || isLoading}
              className={`w-full py-3 px-8 rounded-full font-semibold text-lg transition-all duration-300 transform ${
                answeredQuestionsCount >= MIN_ANSWERS_REQUIRED && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg shadow-blue-600/20'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Analyzing...' : 'Analyze My Mood 🎵'}
            </button>

            {answeredQuestionsCount < MIN_ANSWERS_REQUIRED && (
              <p className="mt-4 text-sm text-yellow-400">
                Please answer {MIN_ANSWERS_REQUIRED - answeredQuestionsCount} more question(s).
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="relative z-10 flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-3xl font-semibold text-white animate-pulse mb-2">{loadingMessage}</h2>
            <p className="text-gray-400">Harnessing AI to understand your unique emotional state.</p>
          </div>
        )}

        {emotionResult && !error && (
          <div className="relative z-10 space-y-5 animate-fade-in">
            <div className="text-7xl mb-4">{getEmotionEmoji(emotionResult.primary_emotion)}</div>
            <h2 className="text-4xl font-bold mb-2">
              Primary Emotion: <span className={`${getEmotionColor(emotionResult.primary_emotion)} capitalize`}>
                {emotionResult.primary_emotion}
              </span>
            </h2>
            <p className="text-gray-300 mb-4">
              AI Confidence: <span className={`${getConfidenceColor(emotionResult.confidence)} font-semibold`}>
                {Math.round(emotionResult.confidence * 100)}%
              </span>
            </p>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 text-left">Detailed Analysis</h3>
              <div className="space-y-2">
                {emotionResult.all_emotions.slice(0, 4).map((emotion, idx) => (
                  <div key={idx} className="flex justify-between items-center text-left">
                    <span className="capitalize text-gray-200 flex items-center text-sm">
                      {getEmotionEmoji(emotion.emotion)} 
                      <span className="ml-2 w-20">{emotion.emotion}</span>
                      {idx === 0 && <span className="ml-2 text-xs bg-blue-600/50 text-blue-300 px-2 py-0.5 rounded-full">Primary</span>}
                    </span>
                    <div className="flex items-center w-2/3">
                      <div className="w-full bg-white/10 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${getEmotionColor(emotion.emotion).replace('text-', 'bg-')}`}
                          style={{ width: `${emotion.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className={`${getEmotionColor(emotion.emotion)} text-sm font-mono w-12 text-right`}>
                        {Math.round(emotion.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {emotionResult.keyword_matches && Object.keys(emotionResult.keyword_matches).length > 0 && (
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-left">
                <h4 className="text-xs font-semibold text-gray-400 mb-2">Keywords Detected:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(emotionResult.keyword_matches).map(([emotion, count]) => (
                    <span key={emotion} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      {emotion}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-lg text-gray-300 pt-4 animate-pulse">
              🎵 Finding the perfect soundtrack for you...
            </p>
          </div>
        )}

        {error && (
          <div className="relative z-10 text-red-500 flex flex-col items-center justify-center h-96">
            <div className="text-5xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-4">Analysis Failed</h2>
            <p className="text-lg text-red-400 mb-8 max-w-sm">{error}</p>
            <button
              onClick={resetState}
              className="py-3 px-8 rounded-full border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
            >
              Try Again 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionQuestionnaire;