import React, { useState } from 'react';
import { FaUpload, FaVideo } from 'react-icons/fa';
import { ReactMediaRecorder } from 'react-media-recorder';
import { useNavigate } from 'react-router-dom';
import './App.css';
import happyImg from './assets/happy.png';
import sadImg from './assets/sad.png';
import angryImg from './assets/angry.png';


const EmotionDetection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const analyzeVideo = async (videoBlob) => {
    setLoading(true);
    setResult(null);
    setShowButton(false);

    const formData = new FormData();
    formData.append('video', new File([videoBlob], 'recorded.mp4', { type: 'video/mp4' }));

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          emotion: data.emotion,
          confidence: data.confidence,
        });
        setShowButton(true);
      } else {
        setResult({ error: data.error });
      }
    } catch (err) {
      setResult({ error: 'Failed to connect to backend.' });
    }

    setLoading(false);
  };

  const handleSuggestions = () => {
    const emotion = result?.emotion?.toLowerCase();
    if (emotion === 'sad') navigate('/sad-songs');
    else if (emotion === 'angry') navigate('/angry-songs');
    else if (emotion === 'happy') navigate('/happy-songs');
    else alert('No song suggestions for this emotion.');
  };

  // New function to navigate to the questionnaire
  const handleQuestionnaireRedirect = () => {
    navigate('/questionnaire');
  };

  return (
      <div className={`w-screen h-screen flex items-center justify-center ${
          result?.emotion ? `${result.emotion}-bg` : 'default-bg'
              }`}>
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Emotion Detection</h1>
        <p className="text-sm text-gray-500">Upload or record a 10-second video to detect your emotion</p>

        <div className="space-y-4">
          {/* Upload Video */}
          <label className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
            <div className="d-flex align-items-center gap-2">
              <img src="/upload.png" width="30" height="30" alt="Upload" className="ml-20" />
              <span>Upload Video</span>
            </div>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  analyzeVideo(file);
                }
              }}
            />
          </label>

          {/* Live Recording */}
          <ReactMediaRecorder
            video
            timeSlice={10000}
            render={({ startRecording, stopRecording, mediaBlobUrl }) => (
              <>
                <button
                  className="w-full px-4 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl inline-flex items-center justify-center transition"
                  onClick={async () => {
                    startRecording();
                    setTimeout(stopRecording, 10000);
                  }}
                >
                  <FaVideo className="mr-2" />
                  Record Live (10s)
                </button>

                {mediaBlobUrl && (
                  <video
                    src={mediaBlobUrl}
                    controls
                    autoPlay
                    muted
                    className="w-full mt-4 rounded-xl"
                    onLoadedMetadata={async () => {
                      const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
                      analyzeVideo(blob);
                    }}
                  />
                )}
              </>
            )}
          />
        </div>

        {/* Results */}
        <div className="mt-6">
          {loading && <p className="text-gray-600 animate-pulse">Analyzing video...</p>}
          {result?.error && <p className="text-red-600 font-medium">Error: {result.error}</p>}
          {result?.emotion && (
            <div className="text-center space-y-2">
               <div className="emoji">
                   {result.emotion === 'happy' && <img src={happyImg} alt="happy" />}
                   {result.emotion === 'sad' && <img src={sadImg} alt="sad" />}
                   {result.emotion === 'angry' && <img src={angryImg} alt="angry" />}
                  </div>
              <p className="text-xl font-semibold text-gray-800">Emotion: {result.emotion}</p>
              <p className="text-md text-gray-600">
                Confidence: {result.confidence.toFixed(1)}%
              </p>

              {showButton && (
                <button
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  onClick={handleSuggestions}
                >
                  🎵 See Song Suggestions
                </button>
              )}
            </div>
          )}
        </div>

        {/* New Questionnaire Button */}
         <button
          className="mt-6 w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          onClick={handleQuestionnaireRedirect}
        >Answer Questionnaire</button>
      </div>
    </div>
  );
};

export default EmotionDetection;
