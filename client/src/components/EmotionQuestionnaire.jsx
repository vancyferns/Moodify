import React, { useState, useMemo } from 'react';

function EmotionQuestionnaire() {
  const questions = [
    "What was the highlight of your day?",
    "What's something that has been on your mind lately?",
    "How are you feeling physically right now?",
    "What are you looking forward to (or not looking forward to)?",
    "If you could describe your current mood in a few words, what would they be?",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [emotionResult, setEmotionResult] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [showSongs, setShowSongs] = useState(false);

  const MIN_ANSWERS_REQUIRED = 3;

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
      'happy': 'text-yellow-300',
      'sad': 'text-blue-400',
      'angry': 'text-red-500',
      'surprised': 'text-teal-300',
      'neutral': 'text-gray-400'
    };
    return colors[emotion] || 'text-indigo-400';
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'surprised': '😲',
      'neutral': '😐'
    };
    return emojis[emotion] || '🎭';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.75) return 'text-green-400';
    if (confidence >= 0.5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const handleSubmit = async () => {
    if (answeredQuestionsCount < MIN_ANSWERS_REQUIRED) return;

    const answeredResponses = answers.filter(ans => ans.trim() !== '');

    setIsLoading(true);
    setError(null);
    setEmotionResult(null);
    setSongs([]);
    setShowSongs(false);
    setLoadingMessage('Analyzing your emotions with AI...');

    const apiUrl = 'http://127.0.0.1:5001/predict';
    const payload = { responses: answeredResponses };

    try {
      const loadingSteps = [
        { msg: 'Processing your emotional patterns...', delay: 1500 },
        { msg: 'Finding perfect songs for your mood...', delay: 3000 },
        { msg: 'Almost done! Finalizing results...', delay: 4500 }
      ];

      loadingSteps.forEach(step => {
        setTimeout(() => {
          if (isLoading) setLoadingMessage(step.msg);
        }, step.delay);
      });

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
      setSongs(data.songs || []);

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
    setSongs([]);
    setError(null);
    setIsLoading(false);
    setShowSongs(false);
  };

  const handleShowSongs = () => {
    setShowSongs(true);
  };

  const SongCard = ({ song, index }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">
            {song.song_title || song.title || 'Unknown Title'}
          </h4>
          <p className="text-gray-400 text-sm mt-1">
            {song.artist || 'Unknown Artist'}
          </p>
          {song.album && (
            <p className="text-gray-500 text-xs mt-1">
              Album: {song.album}
            </p>
          )}
          {song.genre && (
            <span className="inline-block bg-purple-600/30 text-purple-300 text-xs px-2 py-1 rounded-full mt-2">
              {song.genre}
            </span>
          )}
          {song.song_uri && (
            <div className="mt-3">
              <audio controls className="w-full h-8" style={{ height: '32px' }}>
                <source src={song.song_uri} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="text-gray-500 text-sm mb-2">
            #{index + 1}
          </div>
          {song.song_image && (
            <img 
              src={song.song_image} 
              alt={song.song_title || 'Song cover'} 
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white pt-[100px] px-4 pb-8 flex justify-center items-start relative z-0">
      <div className="relative bg-[#1a1a2e] bg-opacity-60 backdrop-blur-md border border-purple-800/50 p-8 rounded-2xl shadow-2xl w-full max-w-4xl text-center">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500 blur-3xl opacity-30 rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500 blur-3xl opacity-30 rounded-full"></div>

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
            <p className="text-gray-400">Harnessing AI to understand your unique emotional state and find perfect songs.</p>
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

            {songs.length > 0 && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    🎵 Songs for Your {emotionResult.primary_emotion} Mood
                  </h3>
                  <span className="text-sm text-gray-400">
                    {songs.length} songs found
                  </span>
                </div>
                
                {!showSongs ? (
                  <button
                    onClick={handleShowSongs}
                    className="w-full py-3 px-6 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Show My Playlist 🎶
                  </button>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-3 custom-scrollbar">
                    {songs.map((song, index) => (
                      <SongCard key={index} song={song} index={index} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {songs.length === 0 && !isLoading && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-yellow-400">
                  No songs found for "{emotionResult.primary_emotion}" emotion in the database.
                </p>
              </div>
            )}

            <button
              onClick={resetState}
              className="mt-6 py-2 px-6 border-2 border-blue-500 text-blue-500 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Analyze Again 🔄
            </button>
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

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.5) rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </div>
  );
}

export default EmotionQuestionnaire;
