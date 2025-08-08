
import React from "react";
import { useNavigate } from "react-router-dom";
import { Video, FileText } from "lucide-react";

const Choose = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6 overflow-hidden">
      
      {/* Glowing Background Bubble */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-30 blur-3xl animate-float z-0"></div>

      {/* Main Section */}
      <section className="text-center max-w-2xl w-full z-10">
        {/* Top Caption */}
        <div className="text-xs uppercase tracking-widest text-purple-400 animate-pulse mb-3">
          🎭 Find Your Mood Match
        </div>

       {/* Typewriter Heading */}
        <h1 className="font-bold text-white mb-4 leading-snug text-center text-2xl sm:text-3xl md:text-4xl">
          <span className="block md:hidden animate-fade-in">Start Your Mood Journey</span>
          <span className="hidden md:inline-block typing-effect">Start Your Mood Journey</span>
        </h1>        

        {/* Subtext */}
        <p className="text-sm text-gray-400 mb-8">
          Select your preferred method to begin your emotion-powered music journey.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button
            onClick={() => navigate("/emotion-detection")}
            className="w-64 bg-[#2d213f] text-white px-5 py-4 rounded-2xl shadow-lg hover:bg-[#b388eb] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm hover:scale-[1.03]"
          >
            <Video className="w-4 h-4" />
            <span className="text-sm font-large">Video</span>
          </button>

          <button
            onClick={() => navigate("/questionnaire")}
            className="w-64 bg-[#2d213f] text-white px-5 py-4 rounded-2xl shadow-lg hover:bg-[#b388eb] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm hover:scale-[1.03]"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-large">Questionnaire</span>
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
           
             @keyframes fadeIn {
               from { opacity: 0 }
               to { opacity: 1 }
                        }
           
             .typing-effect {
               white-space: nowrap;
               overflow: hidden;
               border-right: 2px solid #C084FC;
               animation: typing 3s steps(30, end) forwards, blink 1s step-end infinite;
             }
           
              .animate-fade-in {
               animation: fadeIn 2s ease-in-out forwards;
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