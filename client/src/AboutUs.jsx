import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import moodifyLogo from "./assets/Moodify_logo3i.png";
import Footer from "./components/Footer";
// 1. Import your custom components
import AnimatedButton from "./components/AnimatedButton";
import FeatureCard from "./components/FeatureCard";
import { Users } from "lucide-react"; // Using a generic icon for the card

// Team Data - Added iconColor for the FeatureCard
const team = [
  { name: "Pearl", role: "Emotion Detection & Frontend", desc: "Built the emotion detection model and crafted frontend experiences.", iconColor: "#c084fc" },
  { name: "Sanket", role: "Questionnaire Developer", desc: "Designed the emotion questionnaire to understand user moods precisely.", iconColor: "#f472b6" },
  { name: "Deepak", role: "Frontend & Responsiveness", desc: "Ensured beautiful UI across all devices with responsive layouts.", iconColor: "#60a5fa" },
  { name: "Soniya", role: "Music Playback Backend", desc: "Engineered the backend to serve music based on emotional data.", iconColor: "#facc15" },
  { name: "Vancy", role: "Music Frontend", desc: "Developed the frontend interface for seamless music discovery.", iconColor: "#4ade80" },
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
    {/* 2. Replaced motion.button with AnimatedButton */}
    <div className="flex justify-center">
        <AnimatedButton onClick={() => console.log("Experience Clicked!")}>
            Experience Moodify
        </AnimatedButton>
    </div>
  </div>
);

// Journey Section
const Journey = () => (
  <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto mb-24">
    <div className="rounded-3xl bg-slate-900/20 backdrop-blur-lg border border-slate-100/10 p-10 md:p-16 relative overflow-hidden">
      <Bubble className="top-10 left-10 w-24 h-24 bg-purple-400/20" />
      <Bubble className="bottom-10 right-10 w-32 h-32 bg-pink-400/25" />

      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div className="space-y-6 text-lg text-gray-300">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Our Journey</h2>
          <p>Moodify began with a simple belief — that music should understand you. What started as a late-night experiment soon evolved into a passion: crafting soundtracks that mirror the rhythm of your heart and mind.</p>
          <p>Today, Moodify blends emotion detection AI with the magic of music to turn feelings into melodies — because your emotions deserve more than silence.</p>
           {/* 3. Replaced motion.button with AnimatedButton */}
          <AnimatedButton onClick={() => console.log("Journey Clicked!")}>
            Join Our Journey
          </AnimatedButton>
        </div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-lg text-center">
          <img src={moodifyLogo} alt="Moodify Logo" className="mx-auto w-32 h-32 object-contain mb-6 rounded-full" />
          <p className="italic text-gray-200">“Music isn’t just something we hear, it’s something we feel — and at Moodify, we make sure it feels right.”</p>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Team Section
const Team = () => (
    <div className="max-w-6xl mx-auto mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Meet Our Team
        </h2>
        {/* 4. Added perspective wrapper and replaced team cards with FeatureCard */}
        <div className="[perspective:1000px]">
            <motion.div
                initial="hidden"
                whileInView="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.2 } }
                }}
                className="grid md:grid-cols-3 lg:grid-cols-5 gap-8"
            >
                {team.map((member) => (
                    <motion.div
                        key={member.name}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.8 }}
                    >
                        <FeatureCard
                            icon={() => (
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-xl text-white">
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                </div>
                            )}
                            title={member.name}
                            description={
                                <>
                                    <p className="font-semibold text-pink-300 mb-2">{member.role}</p>
                                    <p>{member.desc}</p>
                                </>
                            }
                            iconColor={member.iconColor}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </div>
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
      {/* <Footer /> */}
    </div>
  );
}