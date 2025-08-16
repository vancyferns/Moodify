import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

// Decorative Bubble
const Bubble = ({ className }) => <div className={`absolute rounded-full blur-3xl animate-pulse ${className}`} />;

// Hero Section
const Hero = () => (
  <div className="relative z-10 max-w-4xl mx-auto text-center mb-12 mt-8">
    <h1 className="text-5xl sm:text-6xl font-extrabold mb-10">
      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        <TypeAnimation sequence={["Your Mood History", 1000]} speed={20} wrapper="span" repeat={0} />
      </span>
    </h1>
    <p className="text-lg sm:text-xl text-gray-300 mb-10">
      Here are the last 10 moods we've detected.
    </p>
  </div>
);

// History List Section
const HistoryList = () => {
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("moodHistory")) || [];
    setMoodHistory(history);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ staggerChildren: 0.2 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <div className="grid grid-cols-1 gap-4">
        {moodHistory.length > 0 ? (
          moodHistory.map((mood, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-purple-300/30"
            >
              <div className="text-center">
                <p className="text-2xl font-semibold">{mood.emotion}</p>
                <p className="text-gray-400 text-sm">{new Date(mood.timestamp).toLocaleString()}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400">No mood history found.</p>
        )}
      </div>
    </motion.div>
  );
};

// Main Page
export default function History() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-[Inter]">
      <main className="flex-grow px-4 py-24 relative overflow-hidden">
        <Bubble className="top-20 left-10 w-32 h-32 bg-purple-400/10" />
        <Bubble className="bottom-32 right-16 w-40 h-40 bg-pink-400/15" />
        <Bubble className="top-1/2 left-1/2 w-96 h-96 bg-purple-300/10 -translate-x-1/2 -translate-y-1/2" />

        <Hero />
        <HistoryList />
      </main>
      <Footer />
    </div>
  );
}
