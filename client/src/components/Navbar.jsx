import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-10 py-4 flex items-center justify-between text-white mb-0">
      <div className="text-xl font-bold">
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          🎵 Moodify
        </span>
      </div>
      <div className="hidden md:flex space-x-8 text-sm">
        <a href="#" className="hover:text-purple-400">Home</a>
        <a href="#" className="hover:text-purple-400">About</a>
        <a href="#" className="hover:text-purple-400">How it works</a>
        <a href="#" className="hover:text-purple-400">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
