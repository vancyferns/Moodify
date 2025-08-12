import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import moodifyLogo from "./assets/mooodifylogo.jpg";
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
