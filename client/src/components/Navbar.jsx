import React, { useState } from "react";
import { Link } from "react-router-dom";
import Moodify_logo from "../assets/Moodify_logo3i.png";
import wavesgif from "../assets/waves22.gif";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // UPDATED: Classes changed for the new centered, pill-shaped style
    <nav 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
                 w-[90%] max-w-lg 
                 rounded-full 
                 bg-slate-900/20 backdrop-blur-lg border border-slate-100/10 
                 px-6 py-3 flex items-center justify-between text-white"
    >
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link to="/" className="flex items-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          <img 
            src={Moodify_logo}  
            alt="Moodify Logo"
            className="h-8 w-14 object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
          /> 
          Moodify
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-sm">
        <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
        <Link to="/about" className="hover:text-purple-400 transition-colors">About</Link>
        <Link to="/how-it-works" className="hover:text-purple-400 transition-colors">How it works</Link>
        {/* Simplified for space */}
        <Link to="/account" className="hover:text-purple-400 transition-colors">Login</Link> 
      </div>

      {/* Hamburger Icon*/}
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="focus:outline-none bg-transparent p-0 flex items-center justify-center h-10 w-10"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span 
              className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Dropdown Menu - Appears below the new navbar */}
      {isOpen && (
        <div 
          className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full
                     rounded-2xl
                     bg-slate-900/20 backdrop-blur-lg border border-slate-100/10
                     flex flex-col items-center p-6 space-y-4 z-40"
        >
          <img
            src={wavesgif}
            alt="Background waves"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none -z-10 rounded-2xl"
          /> 
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/how-it-works", label: "How it works" },
            { to: "/songs", label: "Songs" },
            { to: "/history", label: "History" },
            { to: "/account", label: "SignUp / SignIn" }
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsOpen(false)}           
              className="text-white hover:text-purple-400 transition-colors w-full text-center py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;