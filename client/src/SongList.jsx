import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import WaveSurfer from "wavesurfer.js";
import "./Songlist.css";

const SongList = () => {
  const location = useLocation();
  const { songs = [], emotion = "Unknown" } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);

  const waveformRef = useRef(null);
  const waveSurferInstance = useRef(null);
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
  const formattedDuration = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const handlePlay = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const togglePlayback = () => {
    if (waveSurferInstance.current) {
      if (isPlaying) {
        waveSurferInstance.current.pause();
        setIsPlaying(false);
      } else {
        waveSurferInstance.current.play();
        setIsPlaying(true);
      }
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

  const onVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (waveSurferInstance.current) {
      waveSurferInstance.current.setVolume(vol);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onSeek = (e) => {
    if (waveSurferInstance.current) {
      const seekTime = Number(e.target.value);
      waveSurferInstance.current.seekTo(seekTime / duration);
    }
  };

  // Check if title overflows
  useEffect(() => {
    if (titleRef.current) {
      setIsTitleOverflowing(
        titleRef.current.scrollWidth > titleRef.current.clientWidth
      );
    }
  }, [currentSong]);

  // Initialize & Load WaveSurfer
  useEffect(() => {
    if (currentSong?.song_uri) {
      if (waveSurferInstance.current) {
        waveSurferInstance.current.destroy();
      }

      waveSurferInstance.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#a855f7",
        progressColor: "#9333ea",
        cursorColor: "#c084fc",
        barWidth: 2,
        responsive: true,
        height: 20,
        normalize: true,
      });

      waveSurferInstance.current.load(currentSong.song_uri);

      waveSurferInstance.current.on("ready", () => {
        setDuration(waveSurferInstance.current.getDuration());
        waveSurferInstance.current.setVolume(volume);
        if (isPlaying) {
          waveSurferInstance.current.play();
        }
      });

      waveSurferInstance.current.on("audioprocess", () => {
        if (
          waveSurferInstance.current &&
          waveSurferInstance.current.isPlaying()
        ) {
          setCurrentTime(waveSurferInstance.current.getCurrentTime());
        }
      });

      waveSurferInstance.current.on("finish", () => {
        playNext();
      });
    }
  }, [currentIndex, currentSong, isPlaying]);

  return (
    <>
      <div className="songlist-container" style={{ paddingBottom: "120px" }}>
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
                <tr
                  key={index}
                  className={currentIndex === index ? "playing" : ""}
                >
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
                      {currentIndex === index && isPlaying ? "Pause" : "Play"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {currentSong && (
        <div className="songlist-bottom-player fixed bottom-0 left-0 w-full bg-gray-900 text-white px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-lg z-50">
          
          {/* Main Desktop Player Layout */}
          <div className="hidden md:flex flex-grow items-center justify-between gap-8 w-full">
            {/* Song Info (LEFT) */}
            <div className="flex items-center gap-4 whitespace-nowrap overflow-hidden flex-grow justify-start basis-1/3">
              <img
                src={currentSong.song_image || "/default-cover.png"}
                alt="cover"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="song-title-container overflow-hidden" ref={titleRef}>
                <h6
                  className={`text-md md:text-lg font-semibold ${
                    isTitleOverflowing ? "animate-marquee" : "truncate"
                  }`}
                >
                  {currentSong.song_title || "Unknown Title"}
                </h6>
                <p className="text-sm md:text-base text-gray-400 truncate">
                  {currentSong.artist || "Unknown Artist"}
                </p>
              </div>
            </div>

            {/* Playback Controls and Seek Bar (CENTER) */}
            <div className="flex flex-col items-center justify-center gap-2 w-full md:w-auto flex-grow-0 basis-1/3">
              <div className="flex items-center justify-center gap-4 w-full">
                <button
                  onClick={playPrev}
                  className="songlist-control-button text-xl md:text-2xl hover:text-purple-400"
                >
                  {" "}
                  ⏮{" "}
                </button>
                <button
                  onClick={togglePlayback}
                  className="songlist-play-toggle text-3xl md:text-4xl hover:text-purple-400"
                >
                  {" "}
                  {isPlaying ? "⏸" : "▶"}{" "}
                </button>
                <button
                  onClick={playNext}
                  className="songlist-control-button text-xl md:text-2xl hover:text-purple-400"
                >
                  {" "}
                  ⏭{" "}
                </button>
              </div>
              {/* Seek Bar and Time */}
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-400">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.01}
                  value={currentTime}
                  onChange={onSeek}
                  className="w-full h-1 accent-purple-400 cursor-pointer"
                />
                <span className="text-xs text-gray-400">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control (RIGHT) */}
            <div className="flex items-center justify-end flex-grow basis-1/3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔊</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={onVolumeChange}
                  className="w-24 h-1 accent-purple-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {/* Main Mobile Player Layout */}
          <div className="flex flex-col md:hidden w-full gap-4">
            {/* Top Row: Song Info and Volume */}
            <div className="flex items-center justify-between w-full">
              {/* Song Info (LEFT) */}
              <div className="flex items-center gap-4 max-w-[calc(100%-120px)]">
                <img
                  src={currentSong.song_image || "/default-cover.png"}
                  alt="cover"
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="overflow-hidden">
                  <h6 className="text-md font-semibold truncate">
                    {currentSong.song_title || "Unknown Title"}
                  </h6>
                  <p className="text-sm text-gray-400 truncate">
                    {currentSong.artist || "Unknown Artist"}
                  </p>
                </div>
              </div>
              
              {/* Volume Control (RIGHT) */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xl">🔊</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={onVolumeChange}
                  className="w-24 h-1 accent-purple-400 cursor-pointer"
                />
              </div>
            </div>
            
            {/* Middle Row: Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={playPrev}
                className="songlist-control-button text-xl hover:text-purple-400"
              >
                {" "}
                ⏮{" "}
              </button>
              <button
                onClick={togglePlayback}
                className="songlist-play-toggle text-3xl hover:text-purple-400"
              >
                {" "}
                {isPlaying ? "⏸" : "▶"}{" "}
              </button>
              <button
                onClick={playNext}
                className="songlist-control-button text-xl hover:text-purple-400"
              >
                {" "}
                ⏭{" "}
              </button>
            </div>
            
            {/* Bottom Row: Seek Bar and Time */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration}
                step={0.01}
                value={currentTime}
                onChange={onSeek}
                className="w-full h-1 accent-purple-400 cursor-pointer"
              />
              <span className="text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {/* Waveform Ref (Hidden) */}
          <div ref={waveformRef} className="w-full mt-2 hidden"></div>
        </div>
      )}
    </>
  );
};

export default SongList;

// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import WaveSurfer from "wavesurfer.js";
// import "./Songlist.css";

// const SongList = () => {
//   const location = useLocation();
//   const { songs = [], emotion = "Unknown" } = location.state || {};

//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);

//   const waveformRef = useRef(null);
//   const waveSurferInstance = useRef(null);
//   const titleRef = useRef(null);

//   const currentSong = currentIndex !== null ? songs[currentIndex] : null;

//   if (songs.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold mb-4">No Songs Found</h1>
//           <p className="text-gray-400">
//             There were no songs provided for the "{emotion}" mood.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const emotionTitle =
//     emotion.toLowerCase() === "happy"
//       ? "😊 Happy Songs"
//       : `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Songs`;

//   const totalSeconds = songs.length * 180;
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   const formattedDuration = `${String(minutes).padStart(2, "0")}:${String(
//     seconds
//   ).padStart(2, "0")}`;

//   const handlePlay = (index) => {
//     setCurrentIndex(index);
//     setIsPlaying(true);
//   };

//   const togglePlayback = () => {
//     if (waveSurferInstance.current) {
//       if (isPlaying) {
//         waveSurferInstance.current.pause();
//         setIsPlaying(false);
//       } else {
//         waveSurferInstance.current.play();
//         setIsPlaying(true);
//       }
//     }
//   };

//   const playNext = () => {
//     if (currentIndex === null) return;
//     const nextIndex = (currentIndex + 1) % songs.length;
//     setCurrentIndex(nextIndex);
//     setIsPlaying(true);
//   };

//   const playPrev = () => {
//     if (currentIndex === null) return;
//     const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
//     setCurrentIndex(prevIndex);
//     setIsPlaying(true);
//   };

//   const onVolumeChange = (e) => {
//     const vol = Number(e.target.value);
//     setVolume(vol);
//     if (waveSurferInstance.current) {
//       waveSurferInstance.current.setVolume(vol);
//     }
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
//       2,
//       "0"
//     )}`;
//   };

//   const onSeek = (e) => {
//     if (waveSurferInstance.current) {
//       const seekTime = Number(e.target.value);
//       waveSurferInstance.current.seekTo(seekTime / duration);
//     }
//   };

//   // Check if title overflows
//   useEffect(() => {
//     if (titleRef.current) {
//       setIsTitleOverflowing(
//         titleRef.current.scrollWidth > titleRef.current.clientWidth
//       );
//     }
//   }, [currentSong]);

//   // Initialize & Load WaveSurfer
//   useEffect(() => {
//     if (currentSong?.song_uri) {
//       if (waveSurferInstance.current) {
//         waveSurferInstance.current.destroy();
//       }

//       waveSurferInstance.current = WaveSurfer.create({
//         container: waveformRef.current,
//         waveColor: "#a855f7",
//         progressColor: "#9333ea",
//         cursorColor: "#c084fc",
//         barWidth: 2,
//         responsive: true,
//         height: 20,
//         normalize: true,
//       });

//       waveSurferInstance.current.load(currentSong.song_uri);

//       waveSurferInstance.current.on("ready", () => {
//         setDuration(waveSurferInstance.current.getDuration());
//         waveSurferInstance.current.setVolume(volume);
//         if (isPlaying) {
//           waveSurferInstance.current.play();
//         }
//       });

//       waveSurferInstance.current.on("audioprocess", () => {
//         if (
//           waveSurferInstance.current &&
//           waveSurferInstance.current.isPlaying()
//         ) {
//           setCurrentTime(waveSurferInstance.current.getCurrentTime());
//         }
//       });

//       waveSurferInstance.current.on("finish", () => {
//         playNext();
//       });
//     }
//   }, [currentIndex, currentSong, isPlaying]);

//   return (
//     <>
//       <div className="songlist-container" style={{ paddingBottom: "120px" }}>
//         <div className="songlist-header">
//           <img src={songs[0]?.song_image} alt="Playlist Cover" />
//           <div>
//             <p className="songlist-header-title">Mood Playlist</p>
//             <h1 className="songlist-header-main">{emotionTitle}</h1>
//             <p className="songlist-header-sub">
//               {songs.length} songs • {formattedDuration}
//             </p>
//           </div>
//         </div>

//         <div className="songlist-table-container">
//           <table className="songlist-table">
//             <thead>
//               <tr>
//                 <th style={{ width: "5%" }}>#</th>
//                 <th style={{ width: "10%" }}>Cover</th>
//                 <th style={{ width: "25%" }}>Title</th>
//                 <th style={{ width: "25%" }}>Artist</th>
//                 <th style={{ width: "15%" }}>Duration</th>
//                 <th style={{ width: "20%" }}>▶ Play</th>
//               </tr>
//             </thead>
//             <tbody>
//               {songs.map((song, index) => (
//                 <tr
//                   key={index}
//                   className={currentIndex === index ? "playing" : ""}
//                 >
//                   <td>{index + 1}</td>
//                   <td>
//                     <img src={song.song_image} alt="cover" />
//                   </td>
//                   <td>{song.song_title}</td>
//                   <td>{song.artist}</td>
//                   <td>{song.duration || "03:00"}</td>
//                   <td>
//                     <button
//                       onClick={() => handlePlay(index)}
//                       className="songlist-play-button"
//                     >
//                       {currentIndex === index && isPlaying ? "Pause" : "Play"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>


//       {currentSong && (
//         <div className="songlist-bottom-player fixed bottom-0 left-0 w-full bg-gray-900 text-white px-4 py-3 md:px-6 md:py-4 flex flex-col gap-2 shadow-lg z-50">
//           {/* Top Row — Song Info & Controls */}
//           <div className="flex items-center justify-between w-full flex-wrap gap-2 md:flex-nowrap">
//             {/* Song Info */}
//             <div className="flex items-center gap-4 max-w-[50%] md:max-w-[30%] whitespace-nowrap overflow-hidden">
//               <img
//                 src={currentSong.song_image || "/default-cover.png"}
//                 alt="cover"
//                 className="w-12 h-12 object-cover rounded"
//               />
//               <div
//                 className="song-title-container overflow-hidden"
//                 ref={titleRef}
//               >
//                 <h6
//                   className={`text-md md:text-lg font-semibold ${
//                     isTitleOverflowing ? "animate-marquee" : "truncate"
//                   }`}
//                 >
//                   {currentSong.song_title || "Unknown Title"}
//                 </h6>
//                 <p className="text-sm md:text-base text-gray-400 truncate">
//                   {currentSong.artist || "Unknown Artist"}
//                 </p>
//               </div>
//             </div>

//             {/* Playback Controls & Volume */}
//             <div className="flex items-center justify-center gap-4 w-full md:w-auto md:ml-auto">
//               <button
//                 onClick={playPrev}
//                 className="songlist-control-button text-xl md:text-2xl hover:text-purple-400"
//               >
//                 ⏮
//               </button>
//               <button
//                 onClick={togglePlayback}
//                 className="songlist-play-toggle text-3xl md:text-4xl hover:text-purple-400"
//               >
//                 {isPlaying ? "⏸" : "▶"}
//               </button>
//               <button
//                 onClick={playNext}
//                 className="songlist-control-button text-xl md:text-2xl hover:text-purple-400"
//               >
//                 ⏭
//               </button>
//              
//             </div>
//             {/* Volume Control for small screens */}
//            
//           </div>
//           {/* Waveform */}
//           <div ref={waveformRef} className="w-full mt-2"></div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SongList;