import { useState, useRef, useEffect } from "react";

const VolumeControl = ({ volume, onVolumeChange }) => {
  const [showVolume, setShowVolume] = useState(false);
  const sliderRef = useRef(null);

  // Hide slider on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target)) {
        setShowVolume(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center volume-wrapper">
      <span
        className="text-purple-500 text-xl cursor-pointer"
        onClick={() => setShowVolume(!showVolume)}
      >
        🔊
      </span>

      {showVolume && (
        <div
          ref={sliderRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center"
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolumeChange}
            className="w-24 h-1 accent-purple-400 cursor-pointer rotate-[-90deg] origin-left"
          />
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
