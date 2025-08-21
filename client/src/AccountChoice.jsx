import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import wavesgif1 from "./assets/waves2.gif";
const AccountChoice = () => {
const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center p-6 overflow-hidden">     
      <img
        src={wavesgif1}
         alt="Background waves"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />
       <div className="relative w-full max-w-2xl text-center z-10 rounded-3xl p-8 bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur-lg shadow-lg">
       
           {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 drop-shadow-lg">
         Welcome to Moodify
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-8">
          Please choose an option to continue:
        </p>

         <div className="flex justify-center gap-12 flex-wrap z-10 mb-6">
  <Link to="/signup" className="block">
    <button
      className="bg-[#A855F7] text-white font-semibold px-12 py-3 rounded-full shadow-md 
                 hover:shadow-purple-500/50 hover:bg-[#9333EA] 
                 hover:scale-105 active:scale-95 transition-all duration-300"
        >
        Sign Up
    </button>
    </Link>

  <Link to="/signin" className="block">
    <button
      className="bg-[#A855F7] text-white font-semibold px-12 py-3 rounded-full shadow-md 
                 hover:shadow-purple-500/50 hover:bg-[#9333EA] 
                 hover:scale-105 active:scale-95 transition-all duration-300"
    >
      Sign In
    </button>
  </Link>
         </div>
       </div>
     </div>
  );
};

export default AccountChoice;

