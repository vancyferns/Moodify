
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-6 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link to="/" className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          🎵 Moodify
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-8 text-sm">
        <Link to="/" className="hover:text-purple-400">Home</Link>
        <Link to="/about" className="hover:text-purple-400">About</Link>
        <Link to="/how-it-works" className="hover:text-purple-400">How it works</Link>
        <Link to="/songs" className="hover:text-purple-400">Songs</Link>
      </div>

      {/* Hamburger Icon*/}
      <div className="md:hidden ml-auto ">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none bg-transparent">
          <svg className="w-5 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              {isOpen ? (
                  <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 18L18 6M6 6l12 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  />
                 ) : (
                <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                 )}
          </svg>
        </button>
      </div>

      {/*Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 right-6 bg-[#1a1a2e] shadow-lg rounded-md py-4 px-6 text-sm flex flex-col space-y-4 md:hidden z-50">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-purple-400">About</Link>
          <Link to="/how-it-works" onClick={() => setIsOpen(false)} className="hover:text-purple-400">How it works</Link>
          <Link to="/songs" onClick={() => setIsOpen(false)} className="hover:text-purple-400">Songs</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
