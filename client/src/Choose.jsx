import React from "react";
import { useNavigate } from "react-router-dom";
import { Video, FileText } from "lucide-react";

const Choose = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6">
      <section className="text-center max-w-3xl w-full">
        {/* Top Caption */}
        <div className="text-sm uppercase tracking-widest text-purple-400 animate-pulse mb-4">
          🎭 Discover How You Feel
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          How Do You Want to Detect Your Emotion
        </h1>

        {/* Buttons Side by Side */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button
            onClick={() => navigate("/emotion-detection")}
            className="w-64 bg-gradient-to-r from-blue-200 via-pink-300 to-purple-300 px-4 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Video className="w-5 h-5" />
            <span>Use Video</span>
          </button>

          <button
            onClick={() => navigate("/questionnaire")}
            className="w-64 bg-gradient-to-r from-blue-200 via-pink-300 to-purple-300 px-4 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <FileText className="w-5 h-5" />
            <span>Answer Questionnaire</span>
          </button>
        </div>
      </section>

      {/* Neon Background Glow */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-3xl opacity-70 rounded-full"></div>
    </div>
  );
};

export default Choose;
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Video , FileText} from "lucide-react"

// const Choose = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6">
//       <section className="text-center">
//         {/* Top Caption */}
//         <div className="text-sm uppercase tracking-widest text-purple-400 animate-pulse mb-4">
//           🎭 Discover How You Feel
//         </div>
       
//          {/* Heading */}
//         <h1 className="text-4xl md:text-5xl font-extrabold text-white">
//           Choose How You Want to Detect Emotion
//         </h1>

//         {/* Buttons */}
//         <div className="flex flex-col items-center gap-y-4 mt-12">
//           <button
//             onClick={() => navigate("/emotion-detection")}
//             className="w-74 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 px-6 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold flex flex-col items-center"
//           > 
//            <Video className="w-4 h-4"/><span>Use Video (Record Live / Upload)</span>
//           </button>
//           <button
//             onClick={() => navigate("/questionnaire")}
//             className="w-74 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 px-6 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold flex flex-col items-center"
//           >
//            <FileText className="w-4 h-4"/><span>Answer Questionnaire</span>
//           </button>
//         </div>
//       </section>

//       {/* Neon Background Glow */}
//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-3xl opacity-70 rounded-full"></div>
//     </div>
//   );
// };

// export default Choose;
