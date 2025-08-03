import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import happyImg from './assets/happy.png';
import sadImg from './assets/sad.png';
import angryImg from './assets/angry.png';
import neutralImg from './assets/neutral.png'; 
import surpriseImg from './assets/surprise.png'; 
import { API_BASE_URL } from "./config";

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
      const response = await fetch(`${ API_BASE_URL }/analyze`, {
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
    
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-6 py-16 flex items-center justify-center text-white font-sans overflow-hidden">
  {/* Bubble Glow */}  
  <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-3xl animate-pulse z-0"></div>
  {/* Content Container */}
  <div className="w-full max-w-2xl text-center z-10">


        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Emotion Detection
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Upload or record a video to detect your emotion
        </p>

        {/* Upload + Record */}
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          
          <label className="bg-[#452c63] text-white font-semibold px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-purple-500  hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]">
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
            className="bg-[#452c63] text-white font-semibold px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-purple-500  hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]"
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
                className="bg-[#452c63] text-white font-semibold px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-purple-500  hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]"
              >
                Submit
              </button>
            )}
          </>
        )}

        {/* Result */}
        {isApproved && result?.emotion && (
  <div className="text-center space-y-4 mt-6">
    <div className="flex justify-center mb-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-60 z-0
            ${
              result.emotion === 'happy' ? 'bg-gradient-to-br from-yellow-400 via-yellow-100 to-yellow-500' :
              result.emotion === 'sad' ? 'bg-gradient-to-br from-blue-300 via-blue-100 to-blue-400' :
              result.emotion === 'angry' ? 'bg-gradient-to-br from-red-300 via-red-100 to-red-400' :
              result.emotion === 'neutral' ? 'bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400' :
              result.emotion === 'surprise' ? 'bg-gradient-to-br from-purple-300 via-purple-100 to-purple-400' :
              ''
            }
          `}
        ></div>

        <img
          src={
            result.emotion === 'happy' ? happyImg :
            result.emotion === 'sad' ? sadImg :
            result.emotion === 'angry' ? angryImg :
            result.emotion === 'neutral' ? neutralImg :
            result.emotion === 'surprise' ? surpriseImg : null
          }
          alt={result.emotion}
          className="relative z-10 w-24 h-24 object-contain rounded-xl border-4 border-white shadow-lg"
        />
      </div>
    </div>
    <p className="text-xl font-semibold capitalize animate-fadeIn">{result.emotion}</p>
    <p className="text-sm text-gray-400">Confidence: {result.confidence.toFixed(1)}%</p>
    {showButton && (
      <button
        className="bg-[#452c63] text-white font-semibold px-4 py-3 rounded-full shadow-md transition duration-300 border-2 border-purple-500 hover:shadow-[0_0_15px_rgba(192,132,255,0.6)]"
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

//   const analyzeVideo = async (videoBlob) => {
//     setLoading(true);
//     setResult(null);
//     setShowButton(false);
//     setIsApproved(false);

//     const formData = new FormData();
//     formData.append('video', new File([videoBlob], 'recorded.webm', { type: 'video/webm' }));

//     try {
//       const response = await fetch("http://localhost:5000/analyze", {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setResult({ emotion: data.emotion, confidence: data.confidence });
//         setShowButton(true);
//       } else {
//         setResult({ error: data.error });
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
//     const emotion = result?.emotion?.toLowerCase();
//     if (emotion === 'sad') navigate('/sad-songs');
//     else if (emotion === 'angry') navigate('/angry-songs');
//     else if (emotion === 'happy') navigate('/happy-songs');
//     else if (emotion === 'surprise') navigate('/surprise-songs');
//     else if (emotion === 'neutral') navigate('/neutral-songs');
//     else alert('No song suggestions for this emotion.');
//   };

//   return (
    
//     <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#241141] px-6 py-16 flex items-center justify-center text-white font-sans">
//       <div className="w-full max-w-2xl text-center">

//         {/* Neon Background */}
//         <div className="absolute top-0 left-0 w-full h-full -z-10">
//           <div className="w-full h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 blur-[120px] opacity-40"></div>
//         </div>

//         <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
//           Emotion Detection
//         </h1>
//         <p className="text-sm text-gray-400 mb-8">
//           Upload or record a video to detect your emotion
//         </p>

//         {/* Upload + Record */}
//         <div className="flex justify-center gap-4 flex-wrap mb-6">
//           <label className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300">
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
//           <label
//             htmlFor="record-control"
//             className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
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

//         {/* Status */}
//         <div className="text-center space-y-2">
//           {loading && <p className="text-purple-300 animate-pulse">Analyzing video...</p>}
//           {result?.error && <p className="text-red-500 font-medium">Error: {result.error}</p>}
//         </div>

//         {/* Video Display */}
//         {!isApproved && playbackURL && (
//           <>
//             <video
//   ref={videoRef}
//   src={playbackURL}
//   controls
//   autoPlay
//   muted={false}
//   className="w-full rounded-xl border border-gray-700 mb-4 max-h-64"
// />

//             {result?.emotion && !loading && (
//               <button
//                 onClick={() => {
//                   URL.revokeObjectURL(playbackURL);
//                   setIsApproved(true);
//                 }}
//                 className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
//               >
//                 Submit
//               </button>
//             )}
//           </>
//         )}

//         {/* Result */}
//         {isApproved && result?.emotion && (
//           <div className="text-center space-y-2">
//             <div className="flex justify-center mb-2">
//               {result.emotion === 'happy' && <img src={happyImg} alt="happy" className="w-30 " />}
//               {result.emotion === 'sad' && <img src={sadImg} alt="sad" className="w-30" />}
//               {result.emotion === 'angry' && <img src={angryImg} alt="angry" className="w-30 " />}
//               {result.emotion === 'neutral' && <img src={neutralImg} alt="neutral" className="w-30 " />}
//               {result.emotion === 'surprise' && <img src={surpriseImg} alt="surprise" className="w-30" />}
//             </div>
//             <p className="text-xl font-semibold">{result.emotion}</p>
//             <p className="text-sm text-gray-400">Confidence: {result.confidence.toFixed(1)}%</p>
//             {showButton && (
//               <button
//                 className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-600 text-white px-4 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
//                 onClick={handleSuggestions}
//               >
//                  Song Suggestions
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmotionDetection;
