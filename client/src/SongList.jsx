import React, { useState } from "react";
import "./Songlist.css";

const SongList = ({ songs, emotion }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setTimeout(() => {
      const audio = document.getElementById("audio-player");
      audio?.play();
    }, 100);
  };

  const togglePlayback = () => {
    const audio = document.getElementById("audio-player");
    if (!audio) return;

    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentIndex === null) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    handlePlay(nextIndex);
  };

  const playPrev = () => {
    if (currentIndex === null) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    handlePlay(prevIndex);
  };

  return (
    <div className="songlist-container">
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

      {/* Fixed Bottom Player */}
      {currentSong && (
        <div className="songlist-bottom-player fixed bottom-0 left-0 w-full bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg z-50">
          {/* Song Info */}
          <div className="flex items-center gap-4 max-w-xs">
            <img
              src={currentSong.song_image || "/default-cover.png"}
              alt="cover"
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <h2 className="text-md font-semibold truncate">
                {currentSong.song_title || "Unknown Title"}
              </h2>
              <p className="text-sm text-gray-400 truncate">
                {currentSong.artist || "Unknown Artist"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={playPrev}
              className="songlist-control-button text-2xl hover:text-green-400"
            >
              ⏮
            </button>
            <button
              onClick={togglePlayback}
              className="songlist-play-toggle text-3xl hover:text-green-400"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={playNext}
              className="songlist-control-button text-2xl hover:text-green-400"
            >
              ⏭
            </button>
          </div>

          <audio
            id="audio-player"
            src={currentSong.song_uri || ""}
            autoPlay
            onEnded={playNext}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default SongList;
