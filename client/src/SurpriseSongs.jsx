import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList";
import { API_BASE_URL } from "./config";

const SurpriseSongs = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/songs/surprised`)
      .then((response) => setSongs(response.data.songs))
      .catch((error) => console.error("Error fetching surprise songs:", error));
  }, []);

  return <SongList songs={songs} emotion="Surprise" />;
};

export default SurpriseSongs;
