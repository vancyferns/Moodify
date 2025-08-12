import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "moodify:songs";

const SongPage = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [picture, setPicture] = useState(null);
  const [filterMood, setFilterMood] = useState("All");

  const [songs, setSongs] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.title = "Your Songs — Moodify";
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  }, [songs]);

  const canSubmit = useMemo(
    () => title.trim() && artist.trim() && mood.trim(),
    [title, artist, mood]
  );

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPicture(reader.result);
    reader.readAsDataURL(file);
  };

  const addSong = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const newSong = {
      id: crypto.randomUUID(),
      title: title.trim(),
      artist: artist.trim(),
      mood: mood.trim(),
      picture: picture || null,
      createdAt: Date.now(),
    };
    setSongs((prev) => [newSong, ...prev]);
    setTitle("");
    setArtist("");
    setMood("");
    setPicture(null);
    alert(`Song added: ${newSong.title} by ${newSong.artist}`);
  };

  const deleteSong = (id) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    alert("Song deleted");
  };

  const filteredSongs =
    filterMood === "All"
      ? songs
      : songs.filter((song) => song.mood.toLowerCase() === filterMood.toLowerCase());

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white px-6 py-12">
      <section className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mt-10 mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Your Songs
          </h1>
          <p className="text-gray-400">
            Add your favorite tracks with mood and picture.
          </p>
        </div>

        {/* Add Form */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Add a new song
          </h2>
          <form onSubmit={addSong} className="grid md:grid-cols-5 gap-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm mb-1">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Song title"
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {/* Artist */}
            <div>
              <label htmlFor="artist" className="block text-sm mb-1">Artist</label>
              <input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist"
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {/* Mood */}
            <div>
              <label htmlFor="mood" className="block text-sm mb-1">Mood</label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select mood</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Angry">Angry</option>
                <option value="Surprised">Surprised</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
            {/* Picture */}
            <div>
              <label htmlFor="picture" className="block text-sm mb-1">Picture</label>
              <input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
            </div>
            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full px-4 py-2 rounded-md font-semibold transition ${
                  canSubmit
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                Add Song
              </button>
            </div>
          </form>
        </div>

        {/* Mood Filter */}
        {songs.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {["All", "Happy", "Sad", "Angry", "Surprised", "Neutral"].map((m) => (
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
        {filteredSongs.length === 0 ? (
          <div className="text-center text-gray-400 bg-white/10 p-6 rounded-xl">
            No songs found for "{filterMood}" mood.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className="bg-white/10 backdrop-blur-md p-5 rounded-xl shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Picture */}
                  {song.picture && (
                    <img
                      src={song.picture}
                      alt={`${song.title} cover`}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}
                  {/* Title / Artist */}
                  <h3 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {song.title}
                  </h3>
                  <p className="text-gray-300">{song.artist}</p>
                  {/* Mood */}
                  <p className="text-sm mt-1 text-gray-400 italic">
                    Mood: {song.mood}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(song.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteSong(song.id)}
                  className="mt-4 text-sm px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SongPage;
