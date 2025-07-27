import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6">
      {/* Hero Section */}
      <section className="text-center">
        <div className="mb-4 mt-4 text-sm uppercase tracking-widest text-purple-400 animate-pulse">
          🎧 Feel First, Play Next
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-6">
          The Beat That Matches Your Feel
        </h1>
        <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-8">
          Feel It. Hear It. — Music that moves with your emotions.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <button
            onClick={() => navigate("/Choose")}
            className="bg-gradient-to-r from-blue-300 via-pink-300 to-purple-300 px-6 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold">
            Get Started
          </button>
          <button className="bg-gradient-to-r from-blue-200 via-pink-300 to-purple-300 px-6 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold">
            Learn more
          </button>
        </div>
      </section>

      {/* Neon Glowing Background */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-3xl opacity-70 rounded-full"></div>
    </div>
  );
};

export default LandingPage;
// import React from "react";

// const LandingPage = () => {
//   return (
//     <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6">
//       {/* Hero Section */}
//       <section className="text-center">
//         <div className="mb-4 mt-4 text-sm uppercase tracking-widest text-purple-400">
//           🎧 Feel First, Play Next
//         </div>
//         <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-6">
//           The Beat That Matches Your Feel
//         </h1>
//         <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-8">
//           Feel It. Hear It. — Music that moves with your emotions.
//         </p>
//         <div className="flex justify-center gap-6 flex-wrap">
//           <button className="bg-purple-600 px-6 py-3 rounded-full hover:bg-purple-700 transition text-white">
//             Get Started
//           </button>
//           <button className="border border-purple-500 px-6 py-3 rounded-full hover:bg-purple-500 hover:text-white transition text-white">
//             Learn more
//           </button>
//         </div>
//       </section>

//       {/* Neon Glowing Background */}
//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-3xl opacity-70 rounded-full"></div>
//     </div>
//   );
// };

// export default LandingPage;
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const LandingPage = () => {
//   const navigate = useNavigate(); // Hook to programmatically navigate

//   return (
//     <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center px-6">
//       {/* Hero Section */}
//       <section className="text-center">
//         <div className="mb-4 mt-4 text-sm uppercase tracking-widest text-purple-400 animate-pulse">
//           🎧 Feel First, Play Next
//         </div>
//         <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-6">
//           The Beat That Matches Your Feel
//         </h1>
//         <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-8">
//           Feel It. Hear It. — Music that moves with your emotions.
//         </p>
//         <div className="flex justify-center gap-6 flex-wrap">
//           <button
//             onClick={() => navigate("/Choose")}
//             className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 px-6 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold">
//             Get Started
//           </button>
//           <button className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 px-6 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 hover:text-white transition text-purple-900 font-semibold">
//             Learn more
//           </button>
//         </div>
//       </section>

//       {/* Neon Glowing Background */}
//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-3xl opacity-70 rounded-full"></div>
//     </div>
//   );
// };

// export default LandingPage;
