import React, { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer"; // Your footer component
import "./Songlist.css";

const PlaybackSpeedSelector = ({ playbackRate, onChangeSpeed }) => {
  const speedOptions = [0.75, 1, 1.25, 1.5, 1.75, 2];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".speed-selector")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="speed-selector relative text-white cursor-pointer select-none"
      style={{ userSelect: "none" }}
    >
      {/* Current speed display */}
      <div
        className="px-2 py-1"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          userSelect: "none",
          color: "white",
          background: "none",
          fontWeight: "normal",
          display: "inline-block",
        }}
        aria-label={`Playback speed ${playbackRate}x. Click to change speed`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setDropdownOpen(!dropdownOpen);
          }
        }}
      >
        {playbackRate}x <span style={{ fontSize: "0.7em" }}>▼</span>
      </div>

      {/* Dropdown list */}
      {dropdownOpen && (
        <div
          className="absolute bottom-full left-0 mb-1 rounded shadow-lg z-50"
          style={{
            minWidth: "60px",
            backgroundColor: "rgba(0,0,0,0.9)",
            userSelect: "none",
          }}
          role="listbox"
          aria-label="Playback speed options"
        >
          {speedOptions.map((speed) => (
            <div
              key={speed}
              onClick={() => {
                onChangeSpeed(speed);
                setDropdownOpen(false);
              }}
              className="px-3 py-1 hover:bg-gray-700"
              style={{
                cursor: "pointer",
                color: playbackRate === speed ? "#22c55e" : "white",
                fontWeight: playbackRate === speed ? "bold" : "normal",
                userSelect: "none",
              }}
              aria-selected={playbackRate === speed}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onChangeSpeed(speed);
                  setDropdownOpen(false);
                }
              }}
            >
              {speed}x
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SongList = ({ songs, emotion }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef(null);

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;

  const emotionTitle =
    emotion.toLowerCase() === "happy" ? "😊 Happy Songs" : `${emotion} Songs`;

  // Estimate 3 mins per song
  const totalSeconds = songs.length * 180;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedDuration = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const handlePlay = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
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

  // Update current time while playing
  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  // Update duration when metadata loads
  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  // Handle seek via slider
  const onSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Change playback speed
  const onChangeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // When currentSong changes, load and play
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      if (isPlaying) {
        audioRef.current.play();
      }
      setCurrentTime(0);
    }
  }, [currentIndex, currentSong, playbackRate]);

  return (
    <>
      <div
        className="songlist-container"
        style={{ paddingBottom: "120px" }} // reserve space for fixed player height
      >
        {/* Emotion Header */}
        <div className="songlist-header">
          <img src={songs[0]?.song_image} alt="Playlist Cover" />
          <div>
            <p className="songlist-header-title">Mood Playlist</p>
            <h1 className="songlist-header-main">{emotionTitle}</h1>
            <p className="songlist-header-sub">
              {songs.length} songs • {formattedDuration}
            </p>
          </div>
        </div>

        {/* Song Table */}
        <div className="songlist-table-container">
          <table className="songlist-table">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "10%" }}>Cover</th>
                <th style={{ width: "25%" }}>Title</th>
                <th style={{ width: "25%" }}>Artist</th>
                <th style={{ width: "15%" }}>Duration</th>
                <th style={{ width: "20%" }}>▶ Play</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img src={song.song_image} alt="cover" />
                  </td>
                  <td>{song.song_title}</td>
                  <td>{song.artist}</td>
                  <td>{song.duration || "03:00"}</td>
                  <td>
                    <button
                      onClick={() => handlePlay(index)}
                      className="songlist-play-button"
                    >
                      Play
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scrollable Footer */}
      </div>
      <Footer />
      <div style={{ width: "100%", height: "100px" }}></div>

      {/* Fixed Bottom Player */}
      {currentSong && (
        <div
          className="songlist-bottom-player fixed bottom-0 left-0 w-full bg-gray-900 text-white px-6 py-3 flex flex-col gap-2 shadow-lg z-50"
        >
          {/* Top row: Song info and controls */}
          <div className="flex items-center gap-6 justify-start w-full">
            {/* Left info */}
            <div className="left-info flex items-center gap-4 max-w-xs whitespace-nowrap overflow-hidden">
              <img
                src={currentSong.song_image || "/default-cover.png"}
                alt="cover"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="truncate">
                <h2 className="text-md font-semibold truncate">
                  {currentSong.song_title || "Unknown Title"}
                </h2>
                <p className="text-sm text-gray-400 truncate">
                  {currentSong.artist || "Unknown Artist"}
                </p>
              </div>
            </div>

            {/* Center controls + speed */}
            <div className="center-controls flex items-center gap-6 ml-auto">
              <button
                onClick={playPrev}
                className="songlist-control-button text-2xl hover:text-green-400"
                aria-label="Previous"
              >
                ⏮
              </button>
              <button
                onClick={togglePlayback}
                className="songlist-play-toggle text-3xl hover:text-green-400"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={playNext}
                className="songlist-control-button text-2xl hover:text-green-400"
                aria-label="Next"
              >
                ⏭
              </button>

              {/* Playback speed dropdown */}
              <PlaybackSpeedSelector playbackRate={playbackRate} onChangeSpeed={onChangeSpeed} />
            </div>
          </div>

          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            step="0.1"
            onChange={onSeek}
            className="w-full h-1 rounded-lg accent-green-400 cursor-pointer"
          />

          {/* Audio element */}
          <audio
            ref={audioRef}
            src={currentSong.song_uri || ""}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={playNext}
          />
        </div>
      )}
    </>
  );
};

export default SongList;
