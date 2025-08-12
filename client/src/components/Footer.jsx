import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-gray-400 py-10 px-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Quotation */}
        <p className="text-center italic text-purple-300 text-lg">
          "Where your emotions meet their perfect melody."
        </p>

        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          
          {/* Left - Privacy / Terms / Moodify */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-purple-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition">Terms of Use</a>
            </div>
            <div className="text-xs text-gray-500">© Moodify {year}</div>
          </div>

          {/* Right - Social Icons */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[FaInstagram, FaFacebookF, FaYoutube, FaGithub].map((Icon, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-purple-400 hover:text-purple-400 transition"
              >
                <Icon className="text-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


// import React from "react";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaYoutube,
//   FaTelegramPlane,
//   FaWhatsapp,
//   FaGooglePlusG,
//   FaViber,
// } from "react-icons/fa";

// const Footer = () => {
//   const year = new Date().getFullYear();

//   return (
//     <footer className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-gray-400 py-10 px-6 border-t border-gray-700">
//       <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        
//         {/* Social Icons */}
//         <div className="flex space-x-4">
//           {[FaFacebookF, FaGooglePlusG, FaInstagram, FaYoutube, FaViber, FaTelegramPlane, FaWhatsapp].map((Icon, i) => (
//             <div
//               key={i}
//               className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-purple-400 hover:text-purple-400 transition"
//             >
//               <Icon className="text-lg" />
//             </div>
//           ))}
//         </div>

//         {/* Links */}
//         <div className="flex space-x-6 text-sm">
//           <a href="#" className="hover:text-purple-400 transition">Privacy Policy</a>
//           <a href="#" className="hover:text-purple-400 transition">Terms of Use</a>
//         </div>

//         {/* Copyright */}
//         <div className="text-xs text-gray-500">
//           © Moodify {year}
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
