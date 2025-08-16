// import { useNavigate } from "react-router-dom";
// import React from "react";
import { Music, Smile, Zap, ChevronDown } from "lucide-react";
import wavesgif from "./assets/waves1.gif";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
const [successMsg, setSuccessMsg] = useState("");

useEffect(() => {
  if (location.state?.message) {
    setSuccessMsg(location.state.message);

  navigate(location.pathname, { replace: true });

    // auto-hide after 3 seconds
    const timer = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(timer);
  }
}, [location.navigate]);



  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] text-white font-sans overflow-x-hidden">
      {/* Success Notification */}
        {successMsg && (
         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 
                  bg-green-500 text-white px-6 py-2 rounded shadow-lg 
                  z-50 animate-fadeIn">
         {successMsg}
       </div>
       )}
       
      {/* Full-page transparent GIF background */}
      <img
        src={wavesgif}
        alt="Background waves"
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
      />

      {/* Bubble Effect Background */}
      <div className="absolute w-[500px] h-[500px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-3xl animate-pulse z-0 top-[10%] left-1/2 -translate-x-1/2"></div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
        {/* Tagline */}
        <div
          className="mb-6 mt-4 text-lg md:text-xl font-semibold tracking-[0.05em] 
          bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 
          text-transparent bg-clip-text animate-pulse drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"
        >
          🎧 Feel First, Play Next
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text mb-6 drop-shadow-lg text-center">
          The Beat That Matches Your Feel
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-8 leading-relaxed text-center">
          Feel It. Hear It. — Music that moves with your emotions.  
          Let the rhythm adapt to your mood in real-time.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6 flex-wrap z-10 mb-6">
          <button
            onClick={() => navigate("/Choose")}
            className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-purple-500/50 hover:bg-[#9333EA] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/how-it-works")}
            className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-purple-500/50 hover:bg-[#9333EA] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Learn more
          </button>
        </div>

        {/* Down Arrow Indicator */}
        <ChevronDown
          className="w-8 h-8 text-purple-400 animate-bounceSlow drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
        />
      </div>

      {/* Features Section */}
      <section className="py-8 relative z-9 mt-2">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Why Moodify?
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          <div className="bg-[#252547] rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
            <Music className="mx-auto w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Adaptive Music</h3>
            <p className="text-gray-400 text-sm">
              Your playlist changes with your mood in real time.
            </p>
          </div>
          <div className="bg-[#252547] rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
            <Smile className="mx-auto w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mood Detection</h3>
            <p className="text-gray-400 text-sm">
              AI detects your emotions and matches the vibe perfectly.
            </p>
          </div>
          <div className="bg-[#252547] rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
            <Zap className="mx-auto w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Play</h3>
            <p className="text-gray-400 text-sm">
              No searching, no waiting — just music that fits you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

