
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
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="focus:outline-none  bg-transparent p-0 flex items-center justify-center"
          style={{ height: '2.5rem' , width: "2.5rem"}}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span 
              className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </div>
        </button>
      </div>


      {/*Dropdown Menu */}
      {isOpen && (
          <div className="absolute top-22 left-0 w-full h-[calc(100vh-64px)] 
          bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#2a2a40] 
          shadow-lg shadow-purple-900/40
          flex flex-col items-center pt-16 pb-8 space-y-8 text-xl font-semibold z-40 
          max-h-[400px] overflow-y-auto"
          >
{[
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/#contact", label: "Contact" },
  ].map((link, i) => (
    <Link
      key={i}
      to={link.to}
      onClick={() => setIsOpen(false)}           
            className="inline-block px-6 py-2 rounded-full 
             bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 
             text-transparent bg-clip-text font-extrabold tracking-wide
             hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 
             hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40
             transition-all duration-300 ease-out"
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
