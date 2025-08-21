import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import "./SongPage.css";
import DeleteModal from "./components/DeleteModal";
import SongAddedModal from "./components/SongAddedModal";

const SongPage = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [songIdToDelete, setSongIdToDelete] = useState(null);

  const [openAddedModal, setOpenAddedModal] = useState(false);
  const [addedSongInfo, setAddedSongInfo] = useState({ name: "", artist: "" });

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [picture, setPicture] = useState(null);
  const [songFile, setSongFile] = useState(null);

  const pictureRef = useRef(null);
  const songFileRef = useRef(null);

  const [filterMood, setFilterMood] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    document.title = "Your Songs — Moodify";
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/songs`);
      let data = Array.isArray(res.data) ? res.data : [];
      setSongs(data);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = useMemo(
    () => title.trim() && artist.trim() && mood.trim() && songFile && picture,
    [title, artist, mood, songFile, picture]
  );

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) setPicture(file);
  };

  const handleSongFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["audio/mpeg", "audio/wav"].includes(file.type)) {
      alert("Please upload a valid MP3 or WAV file.");
      return;
    }

    setSongFile(file);
  };

  const addSong = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("song_name", title.trim());
      formData.append("song_artist", artist.trim());
      formData.append("song_mood", mood.trim());
      formData.append("song_image", picture);
      formData.append("song_file", songFile);

      const res = await axios.post(`${API_BASE_URL}/api/songs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSongs((prev) => [res.data, ...prev]);

      // reset form
      setTitle("");
      setArtist("");
      setMood("");
      setPicture(null);
      setSongFile(null);
      if (pictureRef.current) pictureRef.current.value = "";
      if (songFileRef.current) songFileRef.current.value = "";

      // show modal instead of alert
      setAddedSongInfo({
        name: res.data.song_name,
        artist: res.data.song_artist,
      });
      setOpenAddedModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to upload song.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSongIdToDelete(id);
    setOpenDeleteModal(true);
  };

  const confirmDeleteSong = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/songs/${songIdToDelete}`);
      setSongs((prev) => prev.filter((s) => s._id !== songIdToDelete));
    } catch (err) {
      console.error(err);
      alert("Failed to delete song.");
    } finally {
      setOpenDeleteModal(false);
      setSongIdToDelete(null);
    }
  };

  const filteredSongs = useMemo(() => {
    if (!Array.isArray(songs)) return [];
    return filterMood === "All"
      ? songs
      : songs.filter(
          (song) =>
            song.song_mood?.toLowerCase() === filterMood.toLowerCase() ||
            song.emotion?.toLowerCase() === filterMood.toLowerCase()
        );
  }, [songs, filterMood]);

  const SongTitle = ({ title }) => {
    const titleRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
      if (titleRef.current) {
        const checkOverflow = () => {
          setIsOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
        };
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
      }
    }, [title]);

    return (
      <h3
        ref={titleRef}
        className={`text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent song-title-container ${
          isOverflowing ? "overflowing" : ""
        }`}
      >
        <span className={isOverflowing ? "animate-marquee" : ""}>{title}</span>
      </h3>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading songs...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white px-4 sm:px-6 lg:px-12 py-12">
      {/* Song Added Modal */}
      <SongAddedModal
        open={openAddedModal}
        onClose={() => setOpenAddedModal(false)}
        songName={addedSongInfo.name}
        songArtist={addedSongInfo.artist}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={openDeleteModal}
        onConfirm={confirmDeleteSong}
        onCancel={() => setOpenDeleteModal(false)}
      />

      <section className="max-w-6xl mx-auto mt-8">
        {/* Heading */}
        <div className="text-center mt-10 mb-10 py-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Your Songs
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Add your favorite tracks with mood and picture.
          </p>
        </div>

        {/* Add Song Form */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Add a new song
          </h2>
          <form
            onSubmit={addSong}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm mb-1">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Song title"
                required
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Artist *</label>
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist"
                required
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mood *</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select mood</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="surprised">Surprised</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm mb-1">Picture *</label>
              <input
                type="file"
                accept="image/*"
                required
                ref={pictureRef}
                onChange={handlePictureChange}
                className="w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm mb-1">Song File *</label>
              <input
                type="file"
                accept=".mp3,.wav"
                required
                ref={songFileRef}
                onChange={handleSongFileChange}
                className="w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-end">
              <button
                type="submit"
                disabled={!canSubmit || uploading}
                className={`w-full px-4 py-2 rounded-md font-semibold transition ${
                  canSubmit && !uploading
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                {uploading ? "Uploading..." : "Add Song"}
              </button>
            </div>
          </form>
        </div>

        {/* Mood Filter */}
        {songs.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {["All", "happy", "sad", "angry", "surprised", "neutral"].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMood(m)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filterMood === m
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Songs List */}
        <div className="pt-6">
          {filteredSongs.length === 0 ? (
            <div className="text-center text-gray-400 bg-white/10 p-6 rounded-xl">
              No songs found for "{filterMood}" mood.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSongs.map((song) => (
                <div
                  key={song._id}
                  className="bg-white/10 backdrop-blur-md p-5 rounded-xl shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {song.song_image && (
                      <img
                        src={song.song_image}
                        alt={`${song.song_name || song.song_title} cover`}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                    )}
                    <SongTitle title={song.song_name || song.song_title} />
                    <p className="text-gray-300">
                      {song.song_artist || song.artist}
                    </p>
                    <p className="text-sm mt-1 text-gray-400 italic">
                      Mood: {song.song_mood || song.emotion}
                    </p>
                    {song.song_uri && (
                      <audio controls className="w-full mt-3">
                        <source src={song.song_uri} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Added{" "}
                      {song.created_at ? new Date(song.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(song._id)}
                    className="mt-4 text-sm px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SongPage;

// import React, { useEffect, useMemo, useState, useRef } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "./config";
// import "./SongPage.css";


// const SongTitle = ({ title }) => {
//   const titleRef = useRef(null);
//   const [isOverflowing, setIsOverflowing] = useState(false);

//   useEffect(() => {
//     if (titleRef.current) {
//       const checkOverflow = () => {
//         setIsOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
//       };
//       checkOverflow();
     
//       window.addEventListener("resize", checkOverflow);
//       return () => window.removeEventListener("resize", checkOverflow);
//     }
//   }, [title]); 

//   return (
//     <h3
//       ref={titleRef}
//       className={`text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent song-title-container ${
//         isOverflowing ? "overflowing" : ""
//       }`}
//     >
//       <span className={isOverflowing ? "animate-marquee" : ""}>
//         {title}
//       </span>
//     </h3>
//   );
// };

// const SongPage = () => {
//   const [title, setTitle] = useState("");
//   const [artist, setArtist] = useState("");
//   const [mood, setMood] = useState("");
//   const [picture, setPicture] = useState(null);
//   const [songFile, setSongFile] = useState(null);
//   const [filterMood, setFilterMood] = useState("All");
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [songs, setSongs] = useState([]);
  

//   useEffect(() => {
//     document.title = "Your Songs — Moodify";
//     fetchSongs();
//   }, []);

//   const fetchSongs = async () => {
//     try {
//       setLoading(true);
//       // Corrected interpolation syntax
//       const res = await axios.get(`${API_BASE_URL}/api/songs`);
//       let data = Array.isArray(res.data) ? res.data : [];
//       setSongs(data);
//     } catch (err) {
//       console.error("Error fetching songs:", err);
//       setSongs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const canSubmit = useMemo(
//     () => title.trim() && artist.trim() && mood.trim() && songFile && picture,
//     [title, artist, mood, songFile, picture]
//   );

//   const handlePictureChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setPicture(file);
//   };

//   const handleSongFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!["audio/mpeg", "audio/wav"].includes(file.type)) {
//       alert("Please upload a valid MP3 or WAV file.");
//       return;
//     }

//     setSongFile(file);
//   };

//   const addSong = async (e) => {
//     e.preventDefault();
//     if (!canSubmit) {
//       alert("All fields are required.");
//       return;
//     }

//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("song_name", title.trim());
//       formData.append("song_artist", artist.trim());
//       formData.append("song_mood", mood.trim());
//       formData.append("song_image", picture);
//       formData.append("song_file", songFile);

//       // Corrected interpolation syntax
//       const res = await axios.post(`${API_BASE_URL}/api/songs`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSongs((prev) => [res.data, ...prev]);
//       setTitle("");
//       setArtist("");
//       setMood("");
//       setPicture(null);
//       setSongFile(null);

//       // Corrected interpolation syntax
//       alert(`Song added: ${res.data.song_name} by ${res.data.song_artist}`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to upload song.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const deleteSong = async (id) => {
//     try {
//       // Corrected interpolation syntax
//       await axios.delete(`${API_BASE_URL}/api/songs/${id}`);
//       setSongs((prev) => prev.filter((s) => s._id !== id));
//       alert("Song deleted");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete song.");
//     }
//   };

//   const filteredSongs = useMemo(() => {
//     if (!Array.isArray(songs)) return [];
//     return filterMood === "All"
//       ? songs
//       : songs.filter(
//           (song) =>
//             (song.song_mood?.toLowerCase() === filterMood.toLowerCase()) ||
//             (song.emotion?.toLowerCase() === filterMood.toLowerCase())
//         );
//   }, [songs, filterMood]);

//   // A new component to handle the conditional marquee
//   // const SongTitle = ({ title }) => {
//   //   const titleRef = useRef(null);
//   //   const [isOverflowing, setIsOverflowing] = useState(false);

//   //   useEffect(() => {
//   //     if (titleRef.current) {
//   //       const checkOverflow = () => {
//   //         setIsOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
//   //       };
//   //       checkOverflow();
//   //       window.addEventListener("resize", checkOverflow);
//   //       return () => window.removeEventListener("resize", checkOverflow);
//   //     }
//   //   }, [title]);

//   //   return (
//   //     <h3
//   //       ref={titleRef}
//   //       className={`text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent song-title-container ${
//   //         isOverflowing ? 'overflowing' : ''
//   //       }`}
//   //     >
//   //       <span className={isOverflowing ? 'animate-marquee' : ''}>
//   //         {title}
//   //       </span>
//   //     </h3>
//   //   );
//   // };

//   if (loading) {
//     return (
//       <main className="min-h-screen flex items-center justify-center text-white">
//         Loading songs...
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white px-6 py-12">
//       <section className="max-w-5xl mx-auto mt-8">
//         {/* Heading */}
//         <div className="text-center mt-16 py-4">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3 ">
//             Your Songs
//           </h1>
//           <p className="text-gray-400 text-sm sm:text-base">
//             Add your favorite tracks with mood and picture.
//           </p>
//         </div>
//         {/* Add Song Form */}
//         <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg mb-10">
//           <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
//             Add a new song
//           </h2>
//           <form
//             onSubmit={addSong}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"

//           >
//             {/* Inputs */}
//             <div className="lg:col-span-2">
//               <label className="block text-sm mb-1">Title *</label>
//               <input
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Song title"
//                 required
//                 className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
//               />
//             </div>
//             <div className="lg:col-span-2">
//               <label className="block text-sm mb-1">Artist *</label>
//               <input
//                 value={artist}
//                 onChange={(e) => setArtist(e.target.value)}
//                 placeholder="Artist"
//                 required
//                 className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
//               />
//             </div>
//             <div className="lg:col-span-2">
//               <label className="block text-sm mb-1">Mood *</label>
//               <select
//                 value={mood}
//                 onChange={(e) => setMood(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 rounded-md bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
//               >
//                 <option value="">Select mood</option>
//                 <option value="happy">Happy</option>
//                 <option value="sad">Sad</option>
//                 <option value="angry">Angry</option>
//                 <option value="surprised">Surprised</option>
//                 <option value="neutral">Neutral</option>
//               </select>
//             </div>
//             <div className="lg:col-span-2 sm:col-span-1 col-span-1">
//               <label className="block text-sm mb-1">Picture *</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 required
//                 onChange={handlePictureChange}
//                 className="w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600"
//               />
//             </div>
//             <div className="lg:col-span-2 sm:col-span-1 col-span-1">
//               <label className="block text-sm mb-1">Song File *</label>
//               <input
//                 type="file"
//                 accept=".mp3,.wav"
//                 required
//                 onChange={handleSongFileChange}
//                 className="w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600"
//               />
//             </div>
//             <div className="lg:col-span-2 flex items-end">
//               <button
//                 type="submit"
//                 disabled={!canSubmit || uploading}
//                 className={`w-full px-4 py-2 rounded-md font-semibold transition ${
//                   canSubmit && !uploading
//                     ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
//                     : "bg-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 {uploading ? "Uploading..." : "Add Song"}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Mood Filter */}
//         {songs.length > 0 && (
//           <div className="flex flex-wrap gap-3 justify-center mb-8">
//             {["All", "happy", "sad", "angry", "surprised", "neutral"].map(
//               (m) => (
//                 <button
//                   key={m}
//                   onClick={() => setFilterMood(m)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition ${
//                     filterMood === m
//                       ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
//                       : "bg-white/10 text-gray-300 hover:bg-white/20"
//                   }`}
//                 >
//                   {m}
//                 </button>
//               )
//             )}
//           </div>
//         )}

//         {/* Songs List */}
//         <div className="pt-6">
//           {filteredSongs.length === 0 ? (
//             <div className="text-center text-gray-400 bg-white/10 p-6 rounded-xl">
//               No songs found for "{filterMood}" mood.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredSongs.map((song) => (
//                 <div
//                   key={song._id}
//                   className="bg-white/10 backdrop-blur-md p-5 rounded-xl shadow-lg flex flex-col justify-between"
//                 >
//                   <div>
//                     {song.song_image && (
//                       <img
//                         src={song.song_image}
//                         alt={`${song.song_name || song.song_title} cover`} // Corrected interpolation
//                         className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-md mb-3"
//                       />
//                     )}
//                     <SongTitle title={song.song_name || song.song_title} />
//                     <p className="text-gray-300">
//                       {song.song_artist || song.artist}
//                     </p>
//                     <p className="text-sm mt-1 text-gray-400 italic">
//                       Mood: {song.song_mood || song.emotion}
//                     </p>
//                     {song.song_uri && (
//                       <audio controls className="w-full mt-3">
//                         <source src={song.song_uri} type="audio/mpeg" />
//                         Your browser does not support the audio element.
//                       </audio>
//                     )}
//                     <p className="text-xs text-gray-500 mt-2">
//                       Added{" "}
//                       {song.created_at
//                         ? new Date(song.created_at).toLocaleString()
//                         : ""}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => deleteSong(song._id)}
//                     className="mt-4 text-sm px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// };

// export default SongPage;