import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function EmotionQuestionnaire() {
  const questions = [
    "What was the highlight of your day?",
    "What's something that has been on your mind lately?",
    "How are you feeling physically right now?",
    "What are you looking forward to (or not looking forward to)?",
    "If you could describe your current mood in a few words, what would they be?"
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [determinedEmotion, setDeterminedEmotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const MIN_ANSWERS_REQUIRED = 3;

  const answeredQuestionsCount = useMemo(() => {
    return answers.filter(answer => answer.trim() !== '').length;
  }, [answers]);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answeredQuestionsCount < MIN_ANSWERS_REQUIRED) return;

    const combinedAnswers = answers
      .map((ans, idx) => `Q: ${questions[idx]} A: ${ans}`)
      .filter(text => text.split('A: ')[1].trim() !== '')
      .join('. ');

    setIsLoading(true);
    setError(null);
    setDeterminedEmotion(null);
    setLoadingMessage('Analyzing your feeling...');

    if (!GEMINI_API_KEY) {
      setError("Gemini API key is not configured. Please check your .env file.");
      setIsLoading(false);
      return;
    }

    const prompt = `Analyze the user's sentiment from the following answers to a questionnaire. Classify the primary emotion into one of the following categories: happy, sad, angry, stressed, neutral. Respond with only the JSON object containing the emotion. Text: "${combinedAnswers}"`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            emotion: {
              type: "STRING",
              enum: ["happy", "sad", "angry", "stressed", "neutral"]
            }
          },
          required: ["emotion"]
        }
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
      const data = await res.json();
      const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(jsonText);
      const emotion = parsed.emotion;

      setDeterminedEmotion(emotion);

      // Navigate to the song route based on emotion
      if (["happy", "sad", "angry"].includes(emotion)) {
        navigate(`/${emotion}-songs`);
      } else {
        setError(`Detected emotion is "${emotion}", but no songs are available for it.`);
      }

    } catch (err) {
      console.error("Emotion analysis error:", err);
      setError("Sorry, we couldn't analyze your feeling. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setAnswers(Array(questions.length).fill(''));
    setDeterminedEmotion(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white flex items-center justify-center p-4">
      <div className="relative bg-[#1a1a2e] bg-opacity-60 backdrop-blur-md border border-purple-800/50 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500 blur-3xl opacity-30 rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500 blur-3xl opacity-30 rounded-full"></div>

        {!isLoading && !determinedEmotion && !error && (
          <form onSubmit={handleSubmit} className="relative z-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-4">How Are You Feeling?</h1>
            <p className="text-gray-300 text-lg mb-6">Answer at least {MIN_ANSWERS_REQUIRED} questions to analyze your emotion.</p>

            <div className="space-y-4 mb-6 text-left">
              {questions.map((q, idx) => (
                <div key={idx}>
                  <label htmlFor={`q-${idx}`} className="block mb-1 text-sm text-purple-300">{q}</label>
                  <input
                    id={`q-${idx}`}
                    type="text"
                    value={answers[idx]}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    className="w-full p-2 bg-[#0f0f1a] border-2 border-purple-800/60 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-500"
                    placeholder="Your answer..."
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={answeredQuestionsCount < MIN_ANSWERS_REQUIRED || isLoading}
              className={`w-full py-3 px-8 rounded-full font-bold text-lg transition ${
                answeredQuestionsCount >= MIN_ANSWERS_REQUIRED && !isLoading
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}>
              Analyze Mood
            </button>

            {answeredQuestionsCount < MIN_ANSWERS_REQUIRED && (
              <p className="mt-3 text-sm text-yellow-400">
                Answer {MIN_ANSWERS_REQUIRED - answeredQuestionsCount} more question(s).
              </p>
            )}
          </form>
        )}

        {isLoading && (
          <div className="z-10">
            <h2 className="text-2xl text-purple-400 animate-pulse">{loadingMessage}</h2>
          </div>
        )}

        {error && (
          <div className="z-10 text-red-400">
            <p className="text-xl mb-6">{error}</p>
            <button
              onClick={resetState}
              className="py-3 px-8 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionQuestionnaire;
