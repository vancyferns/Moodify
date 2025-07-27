import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import happyImg from './assets/happy.png';
import sadImg from './assets/sad.png';
import angryImg from './assets/angry.png';
import neutralImg from './assets/neutral.png'; 
import surpriseImg from './assets/surprise.png'; 

const EmotionDetection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [playbackURL, setPlaybackURL] = useState(null);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const analyzeVideo = async (videoBlob) => {
    setLoading(true);
    setResult(null);
    setShowButton(false);
    setIsApproved(false);

    const formData = new FormData();
    formData.append('video', new File([videoBlob], 'recorded.webm', { type: 'video/webm' }));

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
      videoRef.current.controls = false;
      videoRef.current.muted = true;
      videoRef.current.play();
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
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPlaybackURL(url);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.muted = false;
        videoRef.current.controls = true;
        videoRef.current.autoplay = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }

      analyzeVideo(blob);
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);

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
    else if (emotion === 'surprise') navigate('/surprise-songs');
    else if (emotion === 'neutral') navigate('/neutral-songs');
    else alert('No song suggestions for this emotion.');
  };

  return (
    
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#241141] px-6 py-16 flex items-center justify-center text-white font-sans">
      <div className="w-full max-w-2xl text-center">

        {/* Neon Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="w-full h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 blur-[120px] opacity-40"></div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Emotion Detection
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Upload or record a video to detect your emotion
        </p>

        {/* Upload + Record */}
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <label className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300">
            Upload Video
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setPlaybackURL(url);
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.srcObject = null;
                    videoRef.current.src = url;
                    videoRef.current.muted = false;
                    videoRef.current.controls = true;
                    videoRef.current.autoplay = true;
                    videoRef.current.onloadedmetadata = () => {
                      videoRef.current.play();
                    };
                  }
                  analyzeVideo(file);
                }
              }}
            />
          </label>
          <label
            htmlFor="record-control"
            className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
          >
            {isRecording ? 'Recording...' : 'Record Live (10s)'}
          </label>
          <input
            id="record-control"
            type="checkbox"
            onChange={startRecording}
            disabled={isRecording}
            className="hidden"
          />
        </div>

        {/* Status */}
        <div className="text-center space-y-2">
          {loading && <p className="text-purple-300 animate-pulse">Analyzing video...</p>}
          {result?.error && <p className="text-red-500 font-medium">Error: {result.error}</p>}
        </div>

        {/* Video Display */}
        {!isApproved && playbackURL && (
          <>
            <video
  ref={videoRef}
  src={playbackURL}
  controls
  autoPlay
  muted={false}
  className="w-full rounded-xl border border-gray-700 mb-4 max-h-64"
/>

            {result?.emotion && !loading && (
              <button
                onClick={() => {
                  URL.revokeObjectURL(playbackURL);
                  setIsApproved(true);
                }}
                className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
              >
                Submit
              </button>
            )}
          </>
        )}

        {/* Result */}
        {isApproved && result?.emotion && (
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              {result.emotion === 'happy' && <img src={happyImg} alt="happy" className="w-30 " />}
              {result.emotion === 'sad' && <img src={sadImg} alt="sad" className="w-30" />}
              {result.emotion === 'angry' && <img src={angryImg} alt="angry" className="w-30 " />}
              {result.emotion === 'neutral' && <img src={neutralImg} alt="neutral" className="w-30 " />}
              {result.emotion === 'surprise' && <img src={surpriseImg} alt="surprise" className="w-30" />}
            </div>
            <p className="text-xl font-semibold">{result.emotion}</p>
            <p className="text-sm text-gray-400">Confidence: {result.confidence.toFixed(1)}%</p>
            {showButton && (
              <button
                className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
                onClick={handleSuggestions}
              >
                 Song Suggestions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDetection;


// import React, { useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './App.css';

// import happyImg from './assets/happy.png';
// import sadImg from './assets/sad.png';
// import angryImg from './assets/angry.png';
// import neutralImg from './assets/neutral.png'; 
// import surpriseImg from './assets/surprise.png'; 

// const EmotionDetection = () => {
//   const [emotionResult, setEmotionResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showButton, setShowButton] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isUploading, setIsUploading] = useState(false); 
//   const [isApproved, setIsApproved] = useState(false);
//   const [playbackURL, setPlaybackURL] = useState(null);
//   const [showLivePreview, setShowLivePreview] = useState(false);

//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);
//   const resultRef = useRef(null);
//   const timeoutRef = useRef(null);
//   const resultImageRef = useRef(null);
  
//   const analyzeVideo = async (videoBlob) => {
//     setLoading(true);
//     setEmotionResult(null);
//     setShowButton(false);
//     setIsApproved(false);

//     const formData = new FormData();
//     formData.append('video', new File([videoBlob], 'recorded.webm', { type: 'video/webm'}));

//     try {
//       const response = await fetch('http://127.0.0.1:5000/analyze', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setEmotionResult({ emotion: data.emotion, confidence: data.confidence });
//         setShowButton(true);
//         setTimeout(() => {
//         if (resultRef.current) {
//           resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//         if (resultImageRef.current) {
//         resultImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   }
//       },100);
//       } else {
//         setEmotionResult({ error: data.error });
//       }
//     } catch (err) {
//       setEmotionResult({ error: 'Failed to connect to backend.' });
//     }

//     setLoading(false);
//   };

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       videoRef.current.controls = false;
//       videoRef.current.muted = true;
//       videoRef.current.play();
//       setShowLivePreview(true);
//     }

//     recordedChunksRef.current = [];

//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorderRef.current = mediaRecorder;

//     mediaRecorder.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         recordedChunksRef.current.push(event.data);
//       }
//     };

//     mediaRecorder.onstop = () => {
//       const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
//       const url = URL.createObjectURL(blob);
//       setPlaybackURL(url);
//         setShowLivePreview(false);

//       if (videoRef.current) {
//         videoRef.current.pause();
//         videoRef.current.srcObject = null;
//         videoRef.current.src = url;
//         videoRef.current.muted = false;
//         videoRef.current.controls = true;
//         videoRef.current.autoplay = true;
//         videoRef.current.onloadedmetadata = () => {
//           videoRef.current.play();
//         };
//       }
//       analyzeVideo(blob);
//       stream.getTracks().forEach((track) => track.stop());
//     };

//     mediaRecorder.start();
//     setIsRecording(true);

//     // Stop recording after 10 seconds
//     setTimeout(() => {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }, 10000);
//   };

//   const handleSuggestions = () => {
//     const emotion = emotionResult?.emotion?.toLowerCase();
//     if (emotion === 'sad') navigate('/sad-songs');
//     else if (emotion === 'angry') navigate('/angry-songs');
//     else if (emotion === 'happy') navigate('/happy-songs');
//     else if (emotion === 'surprise') navigate('/surprise-songs');
//     else if (emotion === 'neutral') navigate('/neutral-songs');
//     else alert('No song suggestions for this emotion.');
//   };

//   const bgClass = emotionResult?.emotion ? `${emotionResult.emotion}-bg` : 'default-bg';
//   const glowClass = emotionResult?.emotion ? `neon-${emotionResult.emotion}-glow` : 'neon-default-glow';

//   const handleQuestionnaireRedirect = () => {
//     navigate('/questionnaire');
//   };

//   return (
//   <div className={`min-h-screen w-screen flex items-center justify-center relative ${
//     isApproved && emotionResult?.emotion ? `${emotionResult.emotion}-bg` : 'default-bg'
//   }`}>
//     {/* Neon Background */}
//     <div className="absolute bottom-0 left-[55%] transform -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-[150px] opacity-80 rounded-full z-0"></div>
//     <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg mx-auto text-center space-y-6 z-10 mt-20 min-h-[200px]">
//       <h1 className="text-3xl font-bold text-gray-800 leading-loose">Emotion Detection</h1>
//       <p className="text-sm text-gray-500 leading-loose">Upload or record a 10-second video to detect your emotion</p>

//       {/* Upload + Record*/}
//       <div className="flex justify-center gap-4 flex-wrap mb-6">
//         <label className={`w-45 text-center cursor-pointer px-6 py-3 rounded-full font-semibold text-white transition ${
//           isRecording
//            ? 'bg-purple-300 text-white cursor-not-allowed'
//            : "bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
//          } inline-block`}>
//           Upload Video
//           <input
//             type="file"
//             accept="video/*"
//             className="hidden"
//             disabled={isRecording}
//               onClick={(e) => {
//              e.target.value = null;
//              setIsUploading(false);
//             }}
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file && !isRecording) {
//                 setIsUploading(true);
//                 const url = URL.createObjectURL(file);
//                 setPlaybackURL(url);
//                 if (videoRef.current) {
//                   videoRef.current.pause();
//                   videoRef.current.srcObject = null;
//                   videoRef.current.src = url;
//                   videoRef.current.muted = false;
//                   videoRef.current.controls = true;
//                   videoRef.current.autoplay = true;
//                   videoRef.current.onloadedmetadata = () => {
//                   videoRef.current.play();
//                   };
//                 }
//                 analyzeVideo(file).finally(() => {
//                 setIsUploading(false);
//                 setTimeout(() => {
//                     if (resultRef.current) {
//                       resultRef.current.scrollIntoView({ behavior: 'smooth' });
//                     }
//                   }, 100);
//                 });
//               }else {
//                  setIsUploading(false); 
//               }
//             }}
//           />
//         </label>
//               <label
//             htmlFor="record-control"
//             className={`w-45 text-center cursor-pointer px-6 py-3 rounded-full font-semibold text-white transition ${
//               isRecording || isUploading
//               ? 'bg-purple-300 text-white cursor-not-allowed' 
//               : "bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
//             }`}
//           >
//             {isRecording ? 'Recording...' : 'Record Live (10s)'}
//           </label>
//           <input
//             id="record-control"
//             type="checkbox"
//             onChange={startRecording}
//             disabled={isRecording || isUploading}
//             className="hidden"
//           />
//         </div>

//         {/* Status */}
//         <div className="text-center space-y-2">
//           {loading && <p className="text-purple-300 animate-pulse">Analyzing video...</p>}
//           {emotionResult?.error && <p className="text-red-500 font-medium">Error: {emotionResult.error}</p>}
//         </div>

//         {/* Video Display */}
//         {!isApproved && playbackURL && (
//           <>
//             <video
//             ref={videoRef}
//             src={playbackURL}
//             controls
//             autoPlay
//             muted={false}
//             className="w-full rounded-xl border border-gray-700 mb-4 max-h-64"
//           />

//             {emotionResult?.emotion && !loading && (
//               <button
//                 onClick={() => {
//                   URL.revokeObjectURL(playbackURL);
//                   setIsApproved(true);
//                 }}
//                 className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
//               >
//                 Submit
//               </button>
//             )}
//           </>
//         )}

//       {/* Results */}
//         {isApproved && emotionResult?.emotion && (
//           <div ref={resultImageRef} className="text-center space-y-2">
//             <div className="flex justify-center mb-2">
//               {emotionResult.emotion === 'happy' && <img src={happyImg} alt="happy" className="w-full max-w-sm md:max-w-md lg:max-w-lg" />}
//               {emotionResult.emotion === 'sad' && <img src={sadImg} alt="sad" className="w-full max-w-sm md:max-w-md lg:max-w-lg" />}
//               {emotionResult.emotion === 'angry' && <img src={angryImg} alt="angry" className="w-full max-w-sm md:max-w-md lg:max-w-lg" />}
//               {emotionResult.emotion === 'neutral' && <img src={neutralImg} alt="neutral" className="w-full max-w-sm md:max-w-md lg:max-w-lg" />}
//               {emotionResult.emotion === 'surprise' && <img src={surpriseImg} alt="surprise" className="w-full max-w-sm md:max-w-md lg:max-w-lg" />}
//             </div>
//             <p className="text-xl font-semibold text-gray-800">Emotion: {emotionResult.emotion}</p>
//             <p className="text-md text-gray-600">
//               Confidence: {emotionResult.confidence.toFixed(1)}%
//             </p>
//             {showButton && (
//               <button
//                 className="suggestion-button"
//                 onClick={handleSuggestions}
//               >
//                 🎵 See Song Suggestions
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default EmotionDetection;