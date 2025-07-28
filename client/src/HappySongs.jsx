import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList"; // ensure this path is correct
import { API_BASE_URL } from "./config";

const HappySongs = () => {
<<<<<<< HEAD
  const [songs, setSongs] = useState([]);
=======
  return (
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold mt-5">😊Happy Songs For Your Mood</h2>
      </div>
>>>>>>> 2dc6825a7f6c41e909b48a54b941c406ffcc75c9

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/songs/happy`)
      .then((response) => setSongs(response.data.songs))
      .catch((error) => console.error("Error fetching happy songs:", error));
  }, []);

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <SongList songs={songs} emotion="Happy" />
    </div>
  );
};

export default HappySongs;
