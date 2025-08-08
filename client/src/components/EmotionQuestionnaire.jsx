import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function EmotionQuestionnaire() {
  // Hook for navigation
  const navigate = useNavigate();

  const questions = [
    "What was the highlight of your day?",
    "What's something that has been on your mind lately?",
    "How are you feeling physically right now?",
    "What are you looking forward to (or not looking forward to)?",
    "If you could describe your current mood in a few words, what would they be?",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const MIN_ANSWERS_REQUIRED = 3;

  const answeredQuestionsCount = useMemo(() => {
    return answers.filter(answer => answer.trim() !== '').length;
  }, [answers]);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answeredQuestionsCount < MIN_ANSWERS_REQUIRED) return;

    const answeredResponses = answers.filter(ans => ans.trim() !== '');

    setIsLoading(true);
    setError(null);
    setLoadingMessage('Analyzing your emotions with AI...');

    const apiUrl = 'http://127.0.0.1:5001/predict';
    const payload = { responses: answeredResponses };

    try {
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

      // *** REDIRECT INSTEAD OF SETTING STATE ***
      // Navigate to the song list page and pass the results in the route's state
      navigate('/songlist', {
        state: {
          songs: data.songs || [],
          emotion: data.primary_emotion
        }
      });

    } catch (err) {
      console.error("Emotion analysis error:", err);
      setError(err.message || "Sorry, we couldn't analyze your emotions. Please try again.");
      setIsLoading(false); // Stop loading on error
    }
    // No finally block needed, as we navigate away on success
  };

  const resetState = () => {
    setAnswers(Array(questions.length).fill(''));
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white pt-[100px] px-4 pb-8 flex justify-center items-start relative z-0">
      <div className="relative bg-[#1a1a2e] bg-opacity-60 backdrop-blur-md border border-purple-800/50 p-8 rounded-2xl shadow-2xl w-full max-w-4xl text-center">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500 blur-3xl opacity-30 rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500 blur-3xl opacity-30 rounded-full"></div>

        {!isLoading && !error && (
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
