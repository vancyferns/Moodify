
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import happyImg from './assets/happy.png';
import sadImg from './assets/sad.png';
import angryImg from './assets/angry.png';

const EmotionDetection = () => {
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  
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
        setResult({ emotion: data.emotion, confidence: data.confidence });
        setShowButton(true);
      } else {
        setResult({ error: data.error });
      }
    } catch (err) {
      setResult({ error: 'Failed to connect to backend.' });
    }

    setLoading(false);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    recordedChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
      analyzeVideo(blob);
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Stop recording after 10 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, 10000);
  };

  const handleSuggestions = () => {
    const emotion = result?.emotion?.toLowerCase();
    if (emotion === 'sad') navigate('/sad-songs');
    else if (emotion === 'angry') navigate('/angry-songs');
    else if (emotion === 'happy') navigate('/happy-songs');
    else alert('No song suggestions for this emotion.');
  };

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

        {/* Upload */}
        <label className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
          Upload Video
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) analyzeVideo(file);
            }}
          />
        </label>

        {/* Live Recording */}
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="w-full px-4 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition"
        >
          {isRecording ? 'Recording...' : 'Record Live (10s)'}
        </button>

        {/* Live Preview */}
        <video ref={videoRef} autoPlay muted className="w-full mt-4 rounded-xl border" />

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

        {/* Questionnaire */}
        <button
          className="mt-6 w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
          onClick={handleQuestionnaireRedirect}
        >
          Answer Questionnaire
        </button>
      </div>
    </div>
  );
};

export default EmotionDetection;
