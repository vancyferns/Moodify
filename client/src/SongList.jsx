import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import "./Songlist.css";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

// The new WaveVisualizer component
const WaveVisualizer = ({ isPlaying }) => {
  return (
    <div className={`wave-container ${isPlaying ? "playing" : ""}`}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

const SongList = () => {
  const location = useLocation();
  const { songs = [], emotion = "Unknown" } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);

  const audioRef = useRef(new Audio());
  const titleRef = useRef(null);

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;

  if (songs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">No Songs Found</h1>
          <p className="text-gray-400">
            There were no songs provided for the "{emotion}" mood.
          </p>
        </div>
      </div>
    );
  }

  const emotionTitle =
    emotion.toLowerCase() === "happy"
      ? "😊 Happy Songs"
      : `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Songs`;

  const totalSeconds = songs.length * 180;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedPlaylistDuration = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  const handlePlay = (index) => {
    if (currentIndex === index) {
      togglePlayback();
    } else {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentIndex === null) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (currentIndex === null) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };

  const onVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
    if (vol > 0) {
      setPrevVolume(vol);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
      audio.volume = 0;
    } else {
      setVolume(prevVolume);
      audio.volume = prevVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onSeek = (e) => {
    const seekTime = Number(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (currentSong?.song_uri) {
      audio.src = currentSong.song_uri;
      audio.load();
      audio.play();
      setIsPlaying(true);
    }

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch((e) => console.error("Playback failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (titleRef.current) {
      setIsTitleOverflowing(
        titleRef.current.scrollWidth > titleRef.current.clientWidth
      );
    }
  }, [currentSong]);

  return (
    <>
      <div className="songlist-container " style={{ paddingBottom: "120px" }}>
        <div className="songlist-header mt-4">
          <img
            src={songs[0]?.song_image}
            alt="Playlist Cover"
            className="w-24 h-24 md:w-48 md:h-48 rounded-lg shadow-lg"
          />
          <div className="flex flex-col justify-end">
            <p className="songlist-header-title">Mood Playlist</p>
            <h1 className="songlist-header-main">{emotionTitle}</h1>
            <p className="songlist-header-sub">
              {songs.length} songs • {formattedPlaylistDuration}
            </p>
          </div>
        </div>

        <div className="songlist-table-container">
          <table className="songlist-table">
            <thead>
              <tr>
                <th className="w-[5%]">#</th>
                <th className="w-[10%] hidden sm:table-cell">Cover</th>
                <th className="w-[40%] sm:w-[25%]">Title</th>
                <th className="w-[30%] sm:w-[25%]">Artist</th>
                <th className="w-[15%] hidden md:table-cell">Duration</th>
                <th className="w-[20%] text-center"></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr
                  key={index}
                  className={currentIndex === index ? "playing" : ""}
                >
                  <td>{index + 1}</td>
                  <td className="hidden sm:table-cell">
                    <img
                      src={song.song_image}
                      alt="cover"
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td>{song.song_title}</td>
                  <td>{song.artist}</td>
                  <td className="hidden md:table-cell">
                    {song.duration || "03:00"}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handlePlay(index)}
                      className="text-white hover:text-purple-400"
                    >
                      {currentIndex === index && isPlaying ? (
                        <FaPause size={20} />
                      ) : (
                        <FaPlay size={20} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      

      {currentSong && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white py-4 px-6 md:px-8 shadow-lg z-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Song Info */}
            <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
              <img
                src={currentSong.song_image || "/default-cover.png"}
                alt="cover"
                className="w-16 h-16 object-cover rounded shadow-lg"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h6
                    className={`text-lg md:text-xl font-semibold mb-1 ${
                      isTitleOverflowing ? "animate-marquee" : "truncate"
                    }`}
                    ref={titleRef}
                  >
                    {currentSong.song_title || "Unknown Title"}
                  </h6>
                  {/* Conditionally render the WaveVisualizer */}
                  {isPlaying && <WaveVisualizer isPlaying={isPlaying} />}
                </div>
                <p className="text-sm md:text-base text-gray-400 truncate">
                  {currentSong.artist || "Unknown Artist"}
                </p>
              </div>
            </div>

            {/* Playback Controls & Progress Bar */}
            <div className="flex flex-col items-center w-full md:flex-1 md:max-w-xl px-4 md:px-0">
              <div className="flex items-center gap-8 mb-4">
                <button
                  onClick={playPrev}
                  className="text-xl md:text-2xl text-purple-400 hover:text-purple-600 transition-colors"
                >
                  <FaStepBackward />
                </button>
                <button
                  onClick={togglePlayback}
                  className="text-4xl md:text-5xl text-purple-400 hover:text-purple-600 transition-colors"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={playNext}
                  className="text-xl md:text-2xl text-purple-400 hover:text-purple-600 transition-colors"
                >
                  <FaStepForward />
                </button>
              </div>
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-400">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={onSeek}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-xs text-gray-400">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 px-4 md:px-0">
              <button
                onClick={toggleMute}
                className="text-md md:text-lg text-purple-400 hover:text-purple-600 transition-colors"
              >
                {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolumeChange}
                className="w-24 md:w-32 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SongList;