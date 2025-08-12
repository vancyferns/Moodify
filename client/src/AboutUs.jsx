import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import moodifyLogo from "./assets/moodifylogo.jpg";
import Footer from "./components/Footer";

// Team Data
const team = [
  { name: "Pearl", role: "Emotion Detection & Frontend", desc: "Built the emotion detection model and crafted frontend experiences.", gradient: "from-purple-500/20 to-purple-300/30" },
  { name: "Sanket", role: "Questionnaire Developer", desc: "Designed the emotion questionnaire to understand user moods precisely.", gradient: "from-pink-400/25 to-purple-400/35" },
  { name: "Deepak", role: "Frontend & Responsiveness", desc: "Ensured beautiful UI across all devices with responsive layouts.", gradient: "from-blue-400/20 to-pink-300/25" },
  { name: "Soniya", role: "Music Playback Backend", desc: "Engineered the backend to serve music based on emotional data.", gradient: "from-yellow-400/20 to-pink-300/30" },
  { name: "Vancy", role: "Music Frontend", desc: "Developed the frontend interface for seamless music discovery.", gradient: "from-green-300/20 to-blue-300/25" },
];

// Decorative Bubble
const Bubble = ({ className }) => <div className={`absolute rounded-full blur-3xl animate-pulse ${className}`} />;

// Hero Section
const Hero = () => (
  <div className="relative z-10 max-w-4xl mx-auto text-center mb-12 mt-8">
    <h1 className="text-5xl sm:text-6xl font-extrabold mb-10">
      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        <TypeAnimation sequence={["About Moodify", 1000]} speed={20} wrapper="span" repeat={0} />
      </span>
    </h1>
    <p className="text-lg sm:text-xl text-gray-300 mb-10">
      We’re a team of dreamers, technologists, and music lovers dedicated to making every beat match your emotions.
    </p>
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#A855F7] px-8 py-4 rounded-full shadow-md hover:shadow-xl hover:bg-[#9333EA] transition">
      Experience Moodify
    </motion.button>
  </div>
);

// Journey Section
const Journey = () => (
  <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto mb-24">
    <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 p-10 md:p-16 backdrop-blur-md relative overflow-hidden">
      <Bubble className="top-10 left-10 w-24 h-24 bg-purple-400/20" />
      <Bubble className="bottom-10 right-10 w-32 h-32 bg-pink-400/25" />

      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div className="space-y-6 text-lg text-gray-300">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Our Journey</h2>
          <p>Moodify began with a simple belief — that music should understand you. What started as a late-night experiment soon evolved into a passion: crafting soundtracks that mirror the rhythm of your heart and mind.</p>
          <p>Today, Moodify blends emotion detection AI with the magic of music to turn feelings into melodies — because your emotions deserve more than silence.</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#A855F7] px-6 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-[#9333EA] transition">
            Join Our Journey
          </motion.button>
        </div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-lg text-center">
          <img src={moodifyLogo} alt="Moodify Logo" className="mx-auto w-35 h-35 object-contain mb-6" />
          <p className="italic text-gray-200">“Music isn’t just something we hear, it’s something we feel — and at Moodify, we make sure it feels right.”</p>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Team Section
const Team = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ staggerChildren: 0.2 }}
    className="max-w-6xl mx-auto mb-8"
  >
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-64 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
      Meet Our Team
    </h2>
    <div className="grid md:grid-cols-3 gap-8 mt-8">
      {team.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className={`p-8 rounded-3xl backdrop-blur-lg bg-gradient-to-br ${m.gradient} relative overflow-hidden`}
        >
          <div className="absolute top-4 right-4 w-16 h-16 bg-purple-400/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-pink-400/15 rounded-full blur-lg" />
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center font-bold text-2xl">
              {m.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h3 className="text-2xl font-semibold">{m.name}</h3>
            <p className="text-pink-300 font-medium mb-3">{m.role}</p>
            <p className="text-gray-200 text-sm">{m.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);


// Main Page
export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-[Inter]">
      <main className="flex-grow px-4 py-24 relative overflow-hidden">
        {/* Decorative Background */}
        <Bubble className="top-20 left-10 w-32 h-32 bg-purple-400/10" />
        <Bubble className="bottom-32 right-16 w-40 h-40 bg-pink-400/15" />
        <Bubble className="top-1/2 left-1/2 w-96 h-96 bg-purple-300/10 -translate-x-1/2 -translate-y-1/2" />

        <Hero />
        <Journey />
        <Team />
      </main>
      <Footer />
    </div>
  );
}



// import React from "react";
// import { motion } from "framer-motion";
// import moodifyLogo from "./assets/moodifylogo.jpg"; 
// import Footer from "./components/Footer";// Adjust path if needed

// const team = [
//   {
//     name: "Pearl",
//     role: "Emotion Detection & Frontend",
//     description: "Built the emotion detection model and crafted frontend experiences.",
//     gradient: "from-purple-500/20 to-purple-300/30",
//   },
//   {
//     name: "Sanket",
//     role: "Questionnaire Developer",
//     description: "Designed the emotion questionnaire to understand user moods precisely.",
//     gradient: "from-pink-400/25 to-purple-400/35",
//   },
//   {
//     name: "Deepak",
//     role: "Frontend & Responsiveness",
//     description: "Ensured beautiful UI across all devices with responsive layouts.",
//     gradient: "from-blue-400/20 to-pink-300/25",
//   },
//   {
//     name: "Soniya",
//     role: "Music Playback Backend",
//     description: "Engineered the backend to serve music based on emotional data.",
//     gradient: "from-yellow-400/20 to-pink-300/30",
//   },
//   {
//     name: "Vancy",
//     role: "Music Frontend",
//     description: "Developed the frontend interface for seamless music discovery.",
//     gradient: "from-green-300/20 to-blue-300/25",
//   },
// ];

// export default function About() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] relative overflow-hidden text-white font-sans">
//       {/* Decorative Bubbles */}
//       <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-32 right-16 w-40 h-40 bg-pink-400/15 rounded-full blur-2xl animate-pulse" />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />

//       <div className="relative z-10 px-6 py-32 max-w-6xl mx-auto">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ staggerChildren: 0.2, delayChildren: 0.1 }}
//           className="text-center mb-24"
//         >
//           <motion.h1
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-5xl md:text-6xl font-bold mb-6"
//           >
//             About Moodify
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10"
//           >
//             We believe music has the power to heal, inspire, and transform. Our mission is to create the perfect soundtrack for every emotion, using cutting-edge AI to understand and respond to your feelings.
//           </motion.p>
//           <motion.button
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
//           >
//             Experience Moodify
//           </motion.button>
//         </motion.div>

//         {/* Our Story Section */}
// <motion.div
//   initial={{ opacity: 0, y: 50 }}
//   whileInView={{ opacity: 1, y: 0 }}
//   viewport={{ once: true }}
//   transition={{ duration: 0.8 }}
//   className="mb-24"
// >
//   <div className="rounded-3xl bg-white/5 p-8 md:p-16 backdrop-blur-md border border-white/10 relative overflow-hidden group">
//     <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//     <div className="relative z-10">
//       <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">Our Story</h2>
//       <div className="grid md:grid-cols-2 gap-12 items-center">
//         <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
//           <p>
//             Born from the idea that technology should understand human emotions, Moodify started as a research project exploring the connection between facial expressions and musical preferences.
//           </p>
//           <p>
//             What began as curiosity evolved into a platform that bridges the gap between how we feel and what we need to hear, creating personalized musical experiences that resonate with your soul.
//           </p>
//         </div>
//         <div className="relative">
//           <div className="w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 absolute -top-10 -right-10" />
//           <div className="relative bg-white/10 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
//             <div className="flex justify-center items-center">
//               <img
//                 src={moodifyLogo}
//                 alt="Moodify Logo"
//                 className="rounded-xl w-full h-auto max-h-64 object-contain"
//               />
//             </div>
            
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </motion.div>  {/* ✅ This was missing */}


//         {/* Team Section */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ staggerChildren: 0.2 }}
//           className="mb-24"
//         >
//           <motion.h2
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-4xl md:text-5xl font-bold text-center mb-16"
//           >
//             Meet Our Team
//           </motion.h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {team.map((member, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.8, delay: i * 0.2 }}
//                 whileHover={{ scale: 1.05 }}
//                 className={`p-8 rounded-3xl backdrop-blur-lg border border-white/10 bg-gradient-to-br ${member.gradient} relative overflow-hidden group`}
//               >
//                 <div className="absolute top-4 right-4 w-16 h-16 bg-purple-400/10 rounded-full blur-xl" />
//                 <div className="absolute bottom-4 left-4 w-12 h-12 bg-pink-400/15 rounded-full blur-lg" />

//                 <div className="relative z-10 text-center">
//                   <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl shadow-md">
//                     {member.name.split(" ").map(n => n[0]).join("")}
//                   </div>
//                   <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
//                   <p className="text-pink-300 font-medium mb-3">{member.role}</p>
//                   <p className="text-gray-200 text-sm">{member.description}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Vision Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="text-center"
//         >
//           <div className="rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-400/25 p-12 md:p-20 backdrop-blur-md border border-white/10 relative overflow-hidden group">
//             <div className="absolute top-8 right-8 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl" />
//             <div className="absolute bottom-8 left-8 w-24 h-24 bg-pink-400/15 rounded-full blur-2xl" />
//             <div className="relative z-10">
//               <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Vision</h2>
//               <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
//                 To create a world where technology understands and nurtures human emotions,
//                 making every moment of your day a little more beautiful through the perfect musical companion.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
//               >
//                 Join Our Journey
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//       <Footer/>
//     </div>
//   );
// }

// import React from "react";
// import { motion } from "framer-motion";



// export default function About() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] text-white font-sans">
//       <div className="relative px-4 py-20 max-w-5xl mx-auto space-y-20">
//         {/* Hero */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ staggerChildren: 0.2 }}
//           className="text-center"
//         >
//           <motion.h1
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-3xl md:text-4xl font-bold mb-4"
//           >
//             About Moodify
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-6"
//           >
//             Moodify uses AI to detect emotions and match them with the perfect music. Our mission is to make every moment more meaningful with sound.
//           </motion.p>
//         </motion.div>

//         {/* Story */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="bg-white/5 p-6 md:p-10 rounded-2xl border border-white/10"
//         >
//           <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Our Story</h2>
//           <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
//             Moodify began as a small project exploring the relationship between emotional states and music. What started as a prototype turned into a smart emotional assistant that helps people feel seen and heard.
//           </p>
//           <p className="text-sm md:text-base text-gray-300 leading-relaxed">
//             We combine emotion detection, curated playlists, and a deep understanding of human feelings to enhance lives through music.
//           </p>
//         </motion.div>

//         {/* Team */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ staggerChildren: 0.2 }}
//         >
//           <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Meet Our Team</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {team.map((member, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: i * 0.1 }}
//                 whileHover={{ scale: 1.03 }}
//                 className={`p-5 rounded-xl border border-white/10 bg-gradient-to-br ${member.gradient}`}
//               >
//                 <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 mx-auto flex items-center justify-center text-white text-lg font-bold shadow-md">
//                   {member.name.slice(0, 2).toUpperCase()}
//                 </div>
//                 <h3 className="text-lg font-semibold text-center">{member.name}</h3>
//                 <p className="text-pink-300 text-sm text-center mb-2">{member.role}</p>
//                 <p className="text-gray-200 text-xs text-center">{member.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Vision */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center bg-gradient-to-br from-purple-500/15 to-pink-400/20 p-8 md:p-12 rounded-2xl border border-white/10"
//         >
//           <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Vision</h2>
//           <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
//             We imagine a future where technology responds empathetically to how we feel—Moodify is a step toward that world, powered by emotion-aware music.
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 text-sm md:text-base rounded-full font-medium shadow-lg"
//           >
//             Join Our Journey
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
