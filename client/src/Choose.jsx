import React from "react";
import { useNavigate } from "react-router-dom";
import { Video, FileText } from "lucide-react";
import wavesgif from "./assets/waves1.gif";

const Choose = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <img
        src={wavesgif}
        alt="Background waves"
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none z-0"
      />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-30 blur-3xl animate-float z-0"></div>

      {/* Main Section */}
      <section className="text-center max-w-2xl w-full z-10">
        <div className="mb-3 mt-2 text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.05em] 
          bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 
          text-transparent bg-clip-text animate-pulse drop-shadow-[0_0_14px_rgba(192,132,252,0.9)]">
          🎭 Find Your Mood Match
        </div>

        {/* Typewriter Heading */}
        <h1 className="typing-effect text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight px-2 sm:px-0">
          Start Your Mood Journey
        </h1>

        {/* Subtext */}
        <p className="text-sm text-gray-400 mb-8 px-2 sm:px-0">
          Select your preferred method to begin your emotion-powered music journey.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate("/emotion-detection")}
            className="bg-[#A855F7] text-white font-medium px-4 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-[#9333EA] transition duration-300 flex items-center justify-center gap-1 text-sm w-40"
          >
            <Video className="w-4 h-4" />
            Video
          </button>

          <button
            onClick={() => navigate("/questionnaire")}
            className="bg-[#A855F7] text-white font-medium px-4 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-[#9333EA] transition duration-300 flex items-center justify-center gap-1 text-sm w-40"
          >
            <FileText className="w-4 h-4" />
            Questionnaire
          </button>
        </div>
      </section>

      {/* Embedded Styling */}
      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink {
          50% { border-color: transparent }
        }
        /* Only run typing effect on medium+ screens */
        @media (min-width: 640px) {
          .typing-effect {
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid #C084FC;
            width: 0;
            animation: typing 2s steps(30, end) forwards, blink 1s step-end infinite;
          }
        }
        /* On mobile, allow wrapping & no fixed width */
        @media (max-width: 639px) {
          .typing-effect {
            white-space: normal;
            border-right: none;
            animation: none;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-20px) }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Choose;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Video, FileText } from "lucide-react";

// const Choose = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6 overflow-hidden">
      
//       {/* Glowing Background Bubble */}
//       <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-30 blur-3xl animate-float z-0"></div>

//       {/* Main Section */}
//       <section className="text-center max-w-2xl w-full z-10">
//         {/* Top Caption */}
//         <div className="text-xs uppercase tracking-widest text-purple-400 animate-pulse mb-3">
//           🎭 Find Your Mood Match
//         </div>

//        {/* Typewriter Heading */}
//         <h1 className="font-bold text-white mb-4 leading-snug text-center text-2xl sm:text-3xl md:text-4xl">
//           <span className="block md:hidden animate-fade-in">Start Your Mood Journey</span>
//           <span className="hidden md:inline-block typing-effect">Start Your Mood Journey</span>
//         </h1>        

//         {/* Subtext */}
//         <p className="text-sm text-gray-400 mb-8">
//           Select your preferred method to begin your emotion-powered music journey.
//         </p>

//         {/* Buttons */}
//         <div className="flex flex-col md:flex-row justify-center items-center gap-6">
//           <button
//             onClick={() => navigate("/emotion-detection")}
//             className="w-64 bg-[#2d213f] text-white px-5 py-4 rounded-2xl shadow-lg hover:bg-[#b388eb] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm hover:scale-[1.03]"
//           >
//             <Video className="w-4 h-4" />
//             <span className="text-sm font-large">Video</span>
//           </button>

//           <button
//             onClick={() => navigate("/questionnaire")}
//             className="w-64 bg-[#2d213f] text-white px-5 py-4 rounded-2xl shadow-lg hover:bg-[#b388eb] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm hover:scale-[1.03]"
//           >
//             <FileText className="w-4 h-4" />
//             <span className="text-sm font-large">Questionnaire</span>
//           </button>
//         </div>
//       </section>

//       {/* Embedded Styling */}
//       <style>{`
//               @keyframes typing {
//                from { width: 0 }
//                to { width: 100% }
//              }
           
//              @keyframes blink {
//                50% { border-color: transparent }
//              }
           
//              @keyframes fadeIn {
//                from { opacity: 0 }
//                to { opacity: 1 }
//                         }
           
//              .typing-effect {
//                white-space: nowrap;
//                overflow: hidden;
//                border-right: 2px solid #C084FC;
//                animation: typing 3s steps(30, end) forwards, blink 1s step-end infinite;
//              }
           
//               .animate-fade-in {
//                animation: fadeIn 2s ease-in-out forwards;
//              }
           
//              @keyframes float {
//                0%, 100% { transform: translateY(0) }
//                50% { transform: translateY(-20px) }
//              }
           
//              .animate-float {
//                animation: float 6s ease-in-out infinite;
//              }           
//          `}</style>
//     </div>
//   );
// };

// export default Choose;