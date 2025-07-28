import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList"; 
import { API_BASE_URL } from "./config";

const SadSongs = () => {
<<<<<<< HEAD
  const [songs, setSongs] = useState([]);
=======
  return (
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold mt-5">
          😔Sad Songs For Your Mood
        </h2>
      </div>
>>>>>>> 2dc6825a7f6c41e909b48a54b941c406ffcc75c9

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/songs/sad`)
      .then((response) => setSongs(response.data.songs))
      .catch((error) => console.error("Error fetching sad songs:", error));
  }, []);

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <SongList songs={songs} emotion="Sad" />
    </div>
  );
};

export default SadSongs;
