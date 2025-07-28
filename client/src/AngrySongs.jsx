import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList"; // make sure this import path is correct
import { API_BASE_URL } from "./config";

const AngrySongs = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/songs/angry`)
      .then((response) => setSongs(response.data.songs))
      .catch((error) => console.error("Error fetching angry songs:", error));
  }, []);

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <SongList songs={songs} emotion="Angry" />
    </div>
  );
};

export default AngrySongs;
