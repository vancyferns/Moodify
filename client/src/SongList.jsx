import React from "react";
import "./Songlist.css";

const SongList = ({ songs, emotion }) => {
  const emotionTitle =
    emotion.toLowerCase() === "happy" ? "😊 Happy Songs" : `${emotion} Songs`;

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-24 pb-10 text-white"
      style={{
        background: "linear-gradient(to bottom, #0f0f1a, #1a1a2e)",
        backdropFilter: "blur(6px)",
        width: "100%",
      }}
    >
      {/* Glow behind heading */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-80 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-2xl opacity-50 rounded-full pointer-events-none z-0"></div>

      {/* Title */}
      <header className="mb-8 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          {emotionTitle}
        </h1>
      </header>

      {/* Song Table */}
      <div className="table-responsive w-75 rounded-4 overflow-hidden shadow-lg border border-purple-500 bg-dark z-10">
        <table className="table table-dark table-hover align-middle rounded-4">
          <thead className="bg-dark text-white">
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "10%" }}>Cover</th>
              <th style={{ width: "30%" }}>Title</th>
              <th style={{ width: "30%" }}>Artist</th>
              <th style={{ width: "25%" }}>▶ Play</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={song.song_image}
                    alt="cover"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </td>
                <td className="text-white">{song.song_title}</td>
                <td className="text-white">{song.artist}</td>
                <td>
                  <audio controls style={{ width: "100px", maxWidth: "100%" }}>
                    <source src={song.song_uri} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongList;
