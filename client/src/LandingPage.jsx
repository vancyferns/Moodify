import { Music, Smile, Zap, ChevronDown } from "lucide-react"; // added ChevronDown
import wavesgif from "./assets/waves2.gif";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import AnimatedButton from "./components/AnimatedButton";
import FeatureCard from "./components/FeatureCard";


const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      navigate(location.pathname, { replace: true });
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] text-white font-sans overflow-x-hidden">
      
      {/* Background */}
      <img
        src={wavesgif}
        alt="Background waves"
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
      />
      <div className="absolute w-[500px] h-[500px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-3xl animate-pulse z-0 top-[10%] left-1/2 -translate-x-1/2"></div>

      {/* Success Message */}
      {successMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 animate-fadeIn">
          {successMsg}
        </div>
      )}

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10 pt-20 sm:pt-24 md:pt-16">

        {/* Hero Text */}
        <div className="mb-6 mt-16 text-lg md:text-xl font-semibold tracking-[0.05em] bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text animate-pulse drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]">
          🎧 Feel First, Play Next
        </div>

        <TypeAnimation
          sequence={[
            'The Beat That Matches Your Vibe.', 3000,
            'The Beat That Matches Your Focus.', 3000,
            'The Beat That Matches Your Joy.', 3000,
            'The Beat That Matches Your Calm.', 3000,
          ]}
          wrapper="h1"
          speed={50}
          repeat={Infinity}
          className="font-cursive text-2xl sm:text-3xl md:text-6xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text mb-6 drop-shadow-lg text-center"
        />

        <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg mt-4 mb-6 leading-relaxed text-center">
          Feel It. Hear It. — Music that moves with your emotions. Let the rhythm
          adapt to your mood in real-time.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6 flex-wrap z-10 mb-4">
          <AnimatedButton onClick={() => navigate("/Choose")}>Get Started</AnimatedButton>
          <AnimatedButton onClick={() => navigate("/how-it-works")}>Learn more</AnimatedButton>
        </div>

        {/* Chevron Down */}
        <ChevronDown className="w-8 h-8 text-purple-400 animate-bounceSlow drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />

      </div>

      {/* Features Section */}
      <motion.section
        className="pt-0 pb-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text pb-4">
          Why Moodify?
        </h2>

        <div className="[perspective:1000px]">
          <motion.div
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={cardVariants}>
              <FeatureCard
                icon={Music}
                title="Adaptive Music"
                description="Your playlist changes with your mood in real time."
                iconColor="#c084fc"
              />
            </motion.div>
            <motion.div variants={cardVariants}>
              <FeatureCard
                icon={Smile}
                title="Mood Detection"
                description="AI detects your emotions and matches the vibe perfectly."
                iconColor="#f472b6"
              />
            </motion.div>
            <motion.div variants={cardVariants}>
              <FeatureCard
                icon={Zap}
                title="Instant Play"
                description="No searching, no waiting — just music that fits you."
                iconColor="#60a5fa"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
