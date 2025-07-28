import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList"; // ensure this path is correct
import { API_BASE_URL } from "./config";

const HappySongs = () => {
  const [songs, setSongs] = useState([]);

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
