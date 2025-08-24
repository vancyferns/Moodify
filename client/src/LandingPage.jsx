import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Music, Heart, Zap, Smile, ChevronDown } from "lucide-react";

import AnimatedButton from "./components/AnimatedButton";
import TeamCard from "./components/TeamCard";

import moodifyLogo from "./assets/Moodify_logo3i.png";
import wavesVideo from "./assets/landvid.mp4";

const journeyData = [
  {
    title: "The Beginning",
    description:
      "Moodify began with a simple belief — that music should understand you. What started as a late-night experiment turned into a passion.",
    icon: Heart,
    iconColor: "#ec4899",
  },
  {
    title: "Blending Tech & Music",
    description:
      "We combined emotion detection AI with the magic of melodies, turning feelings into soundscapes.",
    icon: Zap,
    iconColor: "#60a5fa",
  },
  {
    title: "Why We Exist",
    description:
      "Because your emotions deserve more than silence. Music isn’t just heard — it’s felt.",
    icon: Music,
    iconColor: "#a78bfa",
  },
];

const team = [
  {
    name: "Pearl",
    initials: "P",
    role: "Emotion Detection & Frontend",
    desc: "Built the emotion detection model.",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    socials: [{ type: "linkedin", href: "#" }, { type: "github", href: "#" }],
  },
  {
    name: "Sanket",
    initials: "S",
    role: "Questionnaire Developer",
    desc: "Designed the emotion questionnaire.",
    gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    socials: [{ type: "linkedin", href: "#" }, { type: "github", href: "#" }],
  },
  {
    name: "Deepak",
    initials: "D",
    role: "Frontend & Responsiveness",
    desc: "Ensured beautiful UI across all devices.",
    gradient: "linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)",
    socials: [{ type: "linkedin", href: "#" }, { type: "github", href: "#" }],
  },
  {
    name: "Soniya",
    initials: "S",
    role: "Music Playback Backend",
    desc: "Engineered the backend to serve music.",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    socials: [{ type: "linkedin", href: "#" }, { type: "github", href: "#" }],
  },
  {
    name: "Vancy",
    initials: "V",
    role: "Music Frontend",
    desc: "Developed the music discovery interface.",
    gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    socials: [{ type: "linkedin", href: "#" }, { type: "github", href: "#" }],
  },
];

// --- FIXED Bubble ---
const Bubble = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl animate-pulse -z-10 ${className}`} />
);

const StyledWrapper = styled.div`
  perspective: 1000px;
  height: 100%;

  .card {
    height: 100%;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 0 20px rgba(128, 90, 213, 0.4);
  }

  .card:hover {
    transform: rotateX(15deg) rotateY(15deg) translateZ(20px);
    box-shadow: 0 10px 30px rgba(128, 90, 213, 0.6),
      0 0 20px rgba(236, 72, 153, 0.5);
  }

  .card_icon,
  .card_title,
  .card_description {
    transition: transform 0.5s;
    transform-style: preserve-3d;
  }

  .card:hover .card_icon,
  .card:hover .card_title,
  .card:hover .card_description {
    transform: translateZ(40px);
  }

  .card_icon {
    margin-bottom: 1rem;
    color: ${(props) => props.iconColor || "#FFF"};
  }

  .card_title {
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .card_description {
    color: #a0aec0;
    font-size: 0.95rem;
    line-height: 1.4;
  }
`;

const JourneyCard = ({ title, description, icon: Icon, iconColor }) => (
  <StyledWrapper iconColor={iconColor}>
    <figure className="card">
      {Icon && (
        <div className="card_icon">
          <Icon size={48} />
        </div>
      )}
      <h3 className="card_title">{title}</h3>
      <p className="card_description">{description}</p>
    </figure>
  </StyledWrapper>
);

const FeatureCard = JourneyCard;

const Journey = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="max-w-6xl mx-auto mb-24 px-6"
  >
    <h2 className="text-4xl py-8 md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
      Our Journey
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      {journeyData.map((item, i) => (
        <JourneyCard key={i} {...item} />
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-lg text-center mt-12"
    >
      <img
        src={moodifyLogo}
        alt="Moodify Logo"
        className="mx-auto w-32 h-32 object-contain mb-6 rounded-full"
      />
      <p className="italic text-gray-200">
        “Music isn’t just something we hear, it’s something we feel — and at
        Moodify, we make sure it feels right.”
      </p>
    </motion.div>
  </motion.div>
);

const Team = () => (
  <div className="max-w-fit mx-auto text-center px-4">
    <h2 className="text-4xl md:text-5xl font-bold pb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
      Meet Our Team
    </h2>
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="flex flex-wrap justify-center gap-8"
    >
      {team.map((member) => (
        <motion.div
          key={member.name}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          <TeamCard {...member} />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState("");
  const whyMoodifyRef = useRef(null);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      navigate(location.pathname, { replace: true });
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleFirstScroll = () => {
      if (window.scrollY > 50) {
        whyMoodifyRef.current?.scrollIntoView({ behavior: "smooth" });
        window.removeEventListener("scroll", handleFirstScroll);
      }
    };
    window.addEventListener("scroll", handleFirstScroll);
    return () => window.removeEventListener("scroll", handleFirstScroll);
  }, []);

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
      <video
        src={wavesVideo}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 translate-y-10"

        // className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover opacity-10 pointer-events-none z-0 "
      />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-20 blur-3xl animate-pulse z-0 top-[10%] left-1/2 -translate-x-1/2"></div>
      <Bubble className="top-1/4 left-10 w-32 h-32 bg-purple-400/10" />
      <Bubble className="bottom-1/3 right-16 w-40 h-40 bg-pink-400/15" />

      {successMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 animate-fadeIn">
          {successMsg}
        </div>
      )}

      {/* Hero */}
      <header className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10 pt-20 sm:pt-24 md:pt-16">
        <div className="mb-6 mt-16 text-lg md:text-xl font-semibold tracking-[0.05em] bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text animate-pulse drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]">
          🎧 Feel First, Play Next
        </div>

        <TypeAnimation
          sequence={[
            "The Beat That Matches Your Vibe.", 3000,
            "The Beat That Matches Your Focus.", 3000,
            "The Beat That Matches Your Joy.", 3000,
            "The Beat That Matches Your Calm.", 3000,
          ]}
          wrapper="h1"
          speed={50}
          repeat={Infinity}
          className="font-extrabold text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text mb-6 drop-shadow-lg text-center"
        />

        <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg mt-4 mb-10 leading-relaxed text-center">
          Feel It. Hear It. — Music that moves with your emotions. Let the rhythm adapt to your mood in real-time.
        </p>

        <div className="flex justify-center gap-6 flex-wrap z-10 mb-8">
          <AnimatedButton onClick={() => navigate("/Choose")}>Get Started</AnimatedButton>
          <AnimatedButton onClick={() => navigate("/how-it-works")}>Learn More</AnimatedButton>
        </div>

        <ChevronDown className="w-8 h-8 text-purple-400 animate-bounceSlow drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
      </header>

      <main>
        {/* Features */}
        <motion.section
          ref={whyMoodifyRef}
          className="py-24 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text pb-4">
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

        {/* About */}
        <section className="py-24 relative z-10 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center mb-12 px-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              About Moodify
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              We’re a team of dreamers, technologists, and music lovers dedicated to making every beat match your emotions.
            </p>
          </div>
          <Journey />
          <Team />
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
