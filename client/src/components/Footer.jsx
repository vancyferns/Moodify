
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
  FaWhatsapp,
  FaGooglePlusG,
  FaViber,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-gray-400 py-10 px-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Social Icons */}
        <div className="flex space-x-4">
          {[FaFacebookF, FaGooglePlusG, FaInstagram, FaYoutube, FaViber, FaTelegramPlane, FaWhatsapp].map((Icon, i) => (
            <div
              key={i}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-purple-400 hover:text-purple-400 transition"
            >
              <Icon className="text-lg" />
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-purple-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-purple-400 transition">Terms of Use</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500">
          © Moodify {year}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
