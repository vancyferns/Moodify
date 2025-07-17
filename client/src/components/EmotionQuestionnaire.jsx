import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function EmotionQuestionnaire() {
  const questions = [
    {
      id: 1,
      text: "How are you feeling right now, at this very moment?",
      options: [
        { text: "Great! Full of energy and optimism.", emotion: "happy", points: 3 },
        { text: "Okay, just going through the day.", emotion: "neutral", points: 1 },
        { text: "A bit low, feeling tired or down.", emotion: "sad", points: 3 },
        { text: "Irritated or frustrated with something.", emotion: "angry", points: 3 },
      ],
    },
    {
      id: 2,
      text: "How has your day been going so far?",
      options: [
        { text: "Fantastic! Everything's flowing smoothly.", emotion: "happy", points: 3 },
        { text: "It's been alright, nothing special.", emotion: "neutral", points: 1 },
        { text: "Quite challenging, feeling a bit overwhelmed.", emotion: "sad", points: 3 },
        { text: "Annoying, things aren't going my way.", emotion: "angry", points: 3 },
      ],
    },
    {
      id: 3,
      text: "Is there anything currently bothering you or causing stress?",
      options: [
        { text: "No, feeling peaceful and calm.", emotion: "happy", points: 3 },
        { text: "A little, but I'm managing.", emotion: "neutral", points: 1 },
        { text: "Yes, quite a bit. It's weighing on me.", emotion: "sad", points: 3 },
        { text: "Definitely. I feel quite agitated by it.", emotion: "angry", points: 3 },
      ],
    },
    {
      id: 4,
      text: "What's your energy level like right now?",
      options: [
        { text: "High and vibrant!", emotion: "happy", points: 3 },
        { text: "Moderate, can get things done.", emotion: "neutral", points: 1 },
        { text: "Low, feeling drained and sluggish.", emotion: "sad", points: 3 },
        { text: "Restless and tense.", emotion: "angry", points: 2 },
      ],
    },
    {
      id: 5,
      text: "How would you describe your current thoughts?",
      options: [
        { text: "Positive and optimistic.", emotion: "happy", points: 3 },
        { text: "Neutral or focused on tasks.", emotion: "neutral", points: 1 },
        { text: "Negative or worrisome.", emotion: "sad", points: 3 },
        { text: "Critical or resentful.", emotion: "angry", points: 3 },
      ],
    },
    {
      id: 6,
      text: "Have you had any recent interactions that affected your mood?",
      options: [
        { text: "Yes, positive ones that uplifted me.", emotion: "happy", points: 3 },
        { text: "Some, but nothing significant.", emotion: "neutral", points: 1 },
        { text: "Yes, they left me feeling down.", emotion: "sad", points: 3 },
        { text: "Yes, they made me feel annoyed or angry.", emotion: "angry", points: 3 },
      ],
    },
    {
      id: 7,
      text: "What's your general outlook on the immediate future (next few hours/day)?",
      options: [
        { text: "Excited and looking forward to it!", emotion: "happy", points: 3 },
        { text: "Neutral, just taking it as it comes.", emotion: "neutral", points: 1 },
        { text: "A bit apprehensive or dreading it.", emotion: "sad", points: 3 },
        { text: "Frustrated about what's ahead.", emotion: "angry", points: 2 },
      ],
    },
    {
      id: 8,
      text: "Are you feeling motivated to do things right now?",
      options: [
        { text: "Yes, very motivated and eager!", emotion: "happy", points: 3 },
        { text: "Somewhat, for necessary tasks.", emotion: "neutral", points: 1 },
        { text: "Not at all, feeling uninspired.", emotion: "sad", points: 3 },
        { text: "Motivated, but mostly by defiance or annoyance.", emotion: "angry", points: 2 },
      ],
    },
    {
      id: 9,
      text: "How do you perceive your current surroundings or environment?",
      options: [
        { text: "Comfortable and pleasant.", emotion: "happy", points: 2 },
        { text: "Just normal, nothing stands out.", emotion: "neutral", points: 1 },
        { text: "Dull or unwelcoming.", emotion: "sad", points: 2 },
        { text: "Irritating or chaotic.", emotion: "angry", points: 3 },
      ],
    },
    {
      id: 10,
      text: "Is there anything specific you're looking forward to or dreading today?",
      options: [
        { text: "Looking forward to something exciting!", emotion: "happy", points: 3 },
        { text: "Nothing particular, just a regular day.", emotion: "neutral", points: 1 },
        { text: "Dreading something or feeling a sense of loss.", emotion: "sad", points: 3 },
        { text: "Feeling angry or resentful about an upcoming event.", emotion: "angry", points: 3 },
      ],
    },
  ];

  const songSuggestions = {
    happy: "happy songs",
    sad: "sad songs",
    angry: "angry songs",
    neutral: "relaxing songs",
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [determinedEmotion, setDeterminedEmotion] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle answer selection
  const handleAnswer = (questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  // Function to go to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // All questions answered, calculate emotion
      calculateEmotion();
      setShowResults(true);
    }
  };

  // Function to calculate the dominant emotion
  const calculateEmotion = () => {
    let happyScore = 0;
    let sadScore = 0;
    let angryScore = 0;

    Object.values(answers).forEach((answer) => {
      if (answer.emotion === "happy") {
        happyScore += answer.points;
      } else if (answer.emotion === "sad") {
        sadScore += answer.points;
      } else if (answer.emotion === "angry") {
        angryScore += answer.points;
      }
      // Neutral points are just for selection, they don't directly add to specific emotion scores
    });

    const scores = {
      happy: happyScore,
      sad: sadScore,
      angry: angryScore,
    };

    let dominantEmotion = "neutral"; // Default if scores are all zero or tied
    let maxScore = 0;

    for (const emotion in scores) {
      if (scores[emotion] > maxScore) {
        maxScore = scores[emotion];
        dominantEmotion = emotion;
      }
    }

    setDeterminedEmotion(dominantEmotion);
  };

  // Reset function to start over
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setDeterminedEmotion(null);
    setShowResults(false);
  };

  // Function to navigate back to the home page (added for consistency if user adds a logo here)
  const handleGoHome = () => {
    navigate('/');
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center">
        {/* Logo/Home Button - Added for consistency if you wish to add a logo here as well */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleGoHome}
            className="text-purple-700 hover:text-purple-900 text-4xl font-extrabold cursor-pointer transition-colors duration-200"
            aria-label="Go to Home"
          >
            HOME
          </button>
        </div>

        {!showResults ? (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Emotion Questionnaire</h1>
            <div className="mb-8 p-6 bg-purple-100 rounded-xl shadow-inner">
              <p className="text-xl font-semibold text-gray-700 mb-4">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <p className="text-2xl text-gray-900 leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                  className={`w-full py-3 px-6 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out
                    ${answers[currentQuestion.id]?.text === option.text
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-purple-200 text-purple-800 hover:bg-purple-300 hover:text-purple-900'
                    }
                    focus:outline-none focus:ring-4 focus:ring-purple-300`}
                >
                  {option.text}
                </button>
              ))}
            </div>
            <button
              onClick={goToNextQuestion}
              disabled={!answers[currentQuestion.id]}
              className={`w-full py-3 px-8 rounded-xl text-xl font-bold transition-all duration-300 ease-in-out
                ${answers[currentQuestion.id]
                  ? 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }
                focus:outline-none focus:ring-4 focus:ring-indigo-300`}
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Get My Songs!"}
            </button>
          </div>
        ) : (
          <div className="results-section">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Emotion: <span className="capitalize text-purple-700">{determinedEmotion}</span></h2>
            <p className="text-xl text-gray-700 mb-8">Here are some song suggestions for you:</p>

            {/* YouTube Search Button */}
            <div className="mb-6">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(songSuggestions[determinedEmotion])}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white
                  ${determinedEmotion === 'happy' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
                  ${determinedEmotion === 'sad' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : ''}
                  ${determinedEmotion === 'angry' ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500' : ''}
                  ${determinedEmotion === 'neutral' ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' : ''}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3a7 7 0 00-7 7c0 3.866 3.134 7 7 7s7-3.134 7-7a7 7 0 00-7-7zm0 12a5 5 0 110-10 5 5 0 010 10zm-2-5a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                </svg>
                Search {determinedEmotion} Songs on YouTube
              </a>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full py-3 px-8 rounded-xl text-xl font-bold bg-purple-600 text-white shadow-xl hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Take Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionQuestionnaire;
