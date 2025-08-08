import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Footer from "./components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const steps = [
  {
    step: "01",
    title: "Record Your Emotions",
    description:
      "Use your device's camera to record your facial expressions or upload a video to detect your emotions.",
  },
  {
    step: "02",
    title: "Analyze Your Emotions",
    description:
      "Our advanced algorithm will analyze your facial expressions and determine your current mood.",
  },
  {
    step: "03",
    title: "Get Tailored Music",
    description:
      "We’ll instantly generate a personalized playlist that fits your detected mood.",
  },
  {
    step: "04",
    title: "Relax & Enjoy",
    description:
      "Sit back and enjoy the perfect music curated just for your current emotional state.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] px-4 py-24 text-center relative overflow-hidden font-[Inter]">

      {/* Bubble background */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 opacity-40 blur-3xl animate-pulse z-0"></div>

      {/* Heading */}
      <div className="relative z-10 max-w-3xl mb-10">
        <h1
          className="text-5xl sm:text-6xl font-extrabold mb-8 mx-auto text-center overflow-hidden"
          style={{ width: "16ch" }}
        >
          <span className="typing-effect bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            How It Works
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10">
          Discover the magic behind Moodify in four beautifully simple steps
        </p>
        <button className="bg-[#A855F7] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-[#9333EA] transition duration-300">
          Try it now
        </button>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 max-w-6xl w-full px-3">
        {steps.map((step, index) => {
          const ref = useRef(null);
          const isInView = useInView(ref, { once: true, margin: "-100px" });

          return (
            <motion.div
              key={index}
              ref={ref}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-r from-[#EBD9FF] via-[#D8B4FE] to-[#C084FC] text-left text-[#1E0E62] shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-6 right-6 text-5xl font-extrabold text-[#9333EA]/20">
                {step.step}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
              <p className="text-base text-[#1E0E62]/80 leading-relaxed">{step.description}</p>
            </motion.div>
          );
        })}
        <style>{`
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          @keyframes blink {
            50% { border-color: transparent }
          }
          .typing-effect {
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid #C084FC;
            width: 0;
            animation: typing 3s steps(10, end) forwards, blink 1s step-end infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) }
            50% { transform: translateY(-20px) }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Footer */}

    </section>

  );
}
