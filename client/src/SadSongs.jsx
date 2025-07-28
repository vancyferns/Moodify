import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList"; 
import { API_BASE_URL } from "./config";

const SadSongs = () => {
  const [songs, setSongs] = useState([]);

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
