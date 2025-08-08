
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer"
import React, { useRef } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6 sm:px-6 overflow-hidden">

      {/* Bubble Effect */}
      <div className="absolute w-[500px] h-[500px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-3xl animate-pulse z-0"></div>

      {/* Hero Section */}
      <section className="text-center z-10 max-w-screen-md w-full">
        <div className="mb-4 mt-6 text-sm uppercase tracking-widest text-purple-400 animate-pulse">
          🎧 Feel First, Play Next
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-6">
          The Beat That Matches Your Feel
        </h1>
        <p className="max-w-xl mx-auto text-gray-300 text-sm sm:text-base md:text-lg mb-8">
          Feel It. Hear It. — Music that moves with your emotions.
        </p>
        <div className="flex justify-center gap-4 flex-wrap px-2 sm:px-0">
          <button
            onClick={() => navigate("/Choose")}
            className="bg-[#452c63] text-white-900 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-[#C084FC] transition duration-300"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/HowItWorks")}
            className="bg-[#452c63] text-white-900 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-[#C084FC] transition duration-300"
          >
            Learn more
          </button>
        </div>

      </section>

    </div>
    
  );
};

export default LandingPage;
