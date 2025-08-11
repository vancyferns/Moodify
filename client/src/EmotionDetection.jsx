import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import happyImg from './assets/happy.png';
import sadImg from './assets/sad.png';
import angryImg from './assets/angry.png';
import neutralImg from './assets/neutral.png';
import surpriseImg from './assets/surprise.png';
import { API_BASE_URL } from "./config";
import wavesgif from "./assets/waves2.gif";

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

  const normalizeEmotion = (emotion) => {
    if (!emotion) return "Unknown";
    const lower = emotion.trim().toLowerCase();
    if (lower === "surprise") return "surprised";
    return lower;
  };

  const analyzeVideo = async (videoBlob) => {
    setLoading(true);
    setResult(null);
    setShowButton(false);
    setIsApproved(false);

    const formData = new FormData();
    formData.append('video', new File([videoBlob], 'recorded.webm', { type: 'video/webm' }));

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult({
          emotion: normalizeEmotion(data.emotion),
          confidence: data.confidence,
          songs: data.songs || []
        });
        setShowButton(true);
      } else {
        setResult({ error: data.error || "Unknown server error" });
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
    if (!result?.emotion) return;
    navigate('/songlist', {
      state: {
        emotion: result.emotion,
        songs: result.songs || []
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-6 py-16 flex items-center justify-center text-white font-sans overflow-hidden">
      {/* Animated background */}
      <img
        src={wavesgif}
        alt="Background waves"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-30 blur-3xl animate-pulse z-0"></div>

      {/* Faded card */}
      
      <div className="w-full max-w-2xl text-center z-10 rounded-3xl p-8 bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur-lg shadow-lg ">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 drop-shadow-lg">
  Emotion Detection
</h1>


        <p className="text-sm text-gray-300 mb-8">Upload or record a video to detect your emotion</p>

        <div className="flex justify-center gap-4 flex-wrap mb-6">
          {/* Upload button */}
          <label className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-[#9333EA] transition duration-300 cursor-pointer">
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

          {/* Record button */}
          <label
            htmlFor="record-control"
            className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-[#9333EA] transition duration-300 cursor-pointer"
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

        {/* Status messages */}
        <div className="text-center space-y-2 min-h-[24px]">
          {loading && <p className="text-purple-300 animate-pulse">Analyzing video...</p>}
          {result?.error && <p className="text-red-400 font-medium">Error: {result.error}</p>}
        </div>

        {/* Video preview */}
        {!isApproved && playbackURL && (
          <>
            <video
              ref={videoRef}
              src={playbackURL}
              controls
              autoPlay
              muted={false}
              className="w-full rounded-xl border border-gray-700 mb-4 max-h-64 outline-none focus:outline-none ring-0 shadow-lg"
            />
            {result?.emotion && !loading && (
              <button
                onClick={() => {
                  URL.revokeObjectURL(playbackURL);
                  setIsApproved(true);
                }}
                className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-[#9333EA] transition duration-300"
              >
                Submit
              </button>
            )}
          </>
        )}

        {/* Emotion result */}
        {isApproved && result?.emotion && (
          <div className="text-center space-y-4 mt-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full blur-md opacity-60 z-0 ${
                    result.emotion === 'happy'
                      ? 'bg-gradient-to-br from-yellow-400 via-yellow-100 to-yellow-500'
                      : result.emotion === 'sad'
                      ? 'bg-gradient-to-br from-blue-300 via-blue-100 to-blue-400'
                      : result.emotion === 'angry'
                      ? 'bg-gradient-to-br from-red-300 via-red-100 to-red-400'
                      : result.emotion === 'neutral'
                      ? 'bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400'
                      : result.emotion === 'surprised'
                      ? 'bg-gradient-to-br from-purple-300 via-purple-100 to-purple-400'
                      : ''
                  }`}
                ></div>
                <img
                  src={
                    result.emotion === 'happy'
                      ? happyImg
                      : result.emotion === 'sad'
                      ? sadImg
                      : result.emotion === 'angry'
                      ? angryImg
                      : result.emotion === 'neutral'
                      ? neutralImg
                      : result.emotion === 'surprised'
                      ? surpriseImg
                      : null
                  }
                  alt={result.emotion}
                  className="relative z-10 w-30 h-30 object-contain rounded-l  shadow-lg"
                />
              </div>
            </div>
           <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 via-pink-400 to-blue-800 text-xl font-semibold capitalize animate-fadeIn drop-shadow-md">
  {"You Seem " + result.emotion}
</p>
            <p className="text-sm text-gray-300">Confidence: {result.confidence.toFixed(1)}%</p>
            {showButton && (
              <button
                className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-[#9333EA] transition duration-300"
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
// import happyImg from './assets/happy.png';
// import sadImg from './assets/sad.png';
// import angryImg from './assets/angry.png';
// import neutralImg from './assets/neutral.png';
// import surpriseImg from './assets/surprise.png';
// import { API_BASE_URL } from "./config";
// import wavesgif from "./assets/waves2.gif";
// const EmotionDetection = () => {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showButton, setShowButton] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isApproved, setIsApproved] = useState(false);
//   const [playbackURL, setPlaybackURL] = useState(null);

//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   const normalizeEmotion = (emotion) => {
//     if (!emotion) return "Unknown";
//     const lower = emotion.trim().toLowerCase();
//     if (lower === "surprise") return "surprised"; // unify for UI consistency
//     return lower;
//   };

//   const analyzeVideo = async (videoBlob) => {
//     setLoading(true);
//     setResult(null);
//     setShowButton(false);
//     setIsApproved(false);

//     const formData = new FormData();
//     formData.append('video', new File([videoBlob], 'recorded.webm', { type: 'video/webm' }));

//     try {
//       const response = await fetch(`${API_BASE_URL}/analyze`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setResult({
//           emotion: normalizeEmotion(data.emotion),
//           confidence: data.confidence,
//           songs: data.songs || []
//         });
//         setShowButton(true);
//       } else {
//         setResult({ error: data.error || "Unknown server error" });
//       }
//     } catch (err) {
//       setResult({ error: 'Failed to connect to backend.' });
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

//     setTimeout(() => {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }, 10000);
//   };

//   const handleSuggestions = () => {
//     if (!result?.emotion) return;

//     navigate('/songlist', {
//       state: {
//         emotion: result.emotion,
//         songs: result.songs || []
//       }
//     });
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-6 py-16 flex items-center justify-center text-white font-sans overflow-hidden">
//       <img
//                     src={wavesgif}
//                     alt="Background waves"
//                     className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
//                   />
//       {/* Background bubble */}
//       <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-3xl animate-pulse z-0"></div>

//       <div className="w-full max-w-2xl text-center z-10">
//         <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
//           Emotion Detection
//         </h1>
//         <p className="text-sm text-gray-400 mb-8">Upload or record a video to detect your emotion</p>

//         <div className="flex justify-center gap-4 flex-wrap mb-6">
//           {/* Upload button */}
//           <label className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-purple-500/50 hover:bg-[#9333EA] hover:scale-105 active:scale-95 transition-all duration-300 px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-purple-500 hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]">
//             Upload Video
//             <input
//               type="file"
//               accept="video/*"
//               className="hidden"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   const url = URL.createObjectURL(file);
//                   setPlaybackURL(url);
//                   if (videoRef.current) {
//                     videoRef.current.pause();
//                     videoRef.current.srcObject = null;
//                     videoRef.current.src = url;
//                     videoRef.current.muted = false;
//                     videoRef.current.controls = true;
//                     videoRef.current.autoplay = true;
//                     videoRef.current.onloadedmetadata = () => {
//                       videoRef.current.play();
//                     };
//                   }
//                   analyzeVideo(file);
//                 }
//               }}
//             />
//           </label>

//           {/* Record button */}
//           <label
//             htmlFor="record-control"
//             className="bg-[#A855F7] text-white font-semibold px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-[#A855F7] hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]"
//           >
//             {isRecording ? 'Recording...' : 'Record Live (10s)'}
//           </label>
//           <input
//             id="record-control"
//             type="checkbox"
//             onChange={startRecording}
//             disabled={isRecording}
//             className="hidden"
//           />
//         </div>

//         {/* Status messages */}
//         <div className="text-center space-y-2">
//           {loading && <p className="text-purple-300 animate-pulse">Analyzing video...</p>}
//           {result?.error && <p className="text-red-500 font-medium">Error: {result.error}</p>}
//         </div>

//         {/* Video preview */}
//         {!isApproved && playbackURL && (
//           <>
//             <video
//               ref={videoRef}
//               src={playbackURL}
//               controls
//               autoPlay
//               muted={false}
//               className="w-full rounded-xl border border-gray-700 mb-4 max-h-64"
//             />

//             {result?.emotion && !loading && (
//               <button
//                 onClick={() => {
//                   URL.revokeObjectURL(playbackURL);
//                   setIsApproved(true);
//                 }}
//                 className="bg-[#452c63] text-white font-semibold px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-purple-500 hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]"
//               >
//                 Submit
//               </button>
//             )}
//           </>
//         )}

//         {/* Emotion result */}
//         {isApproved && result?.emotion && (
//           <div className="text-center space-y-4 mt-6">
//             <div className="flex justify-center mb-4">
//               <div className="relative w-40 h-40 flex items-center justify-center">
//                 <div
//                   className={`absolute inset-0 rounded-full blur-md opacity-60 z-0 ${
//                     result.emotion === 'happy'
//                       ? 'bg-gradient-to-br from-yellow-400 via-yellow-100 to-yellow-500'
//                       : result.emotion === 'sad'
//                       ? 'bg-gradient-to-br from-blue-300 via-blue-100 to-blue-400'
//                       : result.emotion === 'angry'
//                       ? 'bg-gradient-to-br from-red-300 via-red-100 to-red-400'
//                       : result.emotion === 'neutral'
//                       ? 'bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400'
//                       : result.emotion === 'surprised'
//                       ? 'bg-gradient-to-br from-purple-300 via-purple-100 to-purple-400'
//                       : ''
//                   }`}
//                 ></div>

//                 <img
//                   src={
//                     result.emotion === 'happy'
//                       ? happyImg
//                       : result.emotion === 'sad'
//                       ? sadImg
//                       : result.emotion === 'angry'
//                       ? angryImg
//                       : result.emotion === 'neutral'
//                       ? neutralImg
//                       : result.emotion === 'surprised'
//                       ? surpriseImg
//                       : null
//                   }
//                   alt={result.emotion}
//                   className="relative z-10 w-24 h-24 object-contain rounded-xl border-4 border-white shadow-lg"
//                 />
//               </div>
//             </div>
//             <p className="text-xl font-semibold capitalize animate-fadeIn">{result.emotion}</p>
//             <p className="text-sm text-gray-400">Confidence: {result.confidence.toFixed(1)}%</p>
//             {showButton && (
//               <button
//                 className="bg-[#452c63] text-white font-semibold px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-purple-500 hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]"
//                 onClick={handleSuggestions}
//               >
//                 Song Suggestions
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmotionDetection;


