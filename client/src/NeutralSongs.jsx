import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList";
import { API_BASE_URL } from "./config";

const NeutralSongs = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/songs/neutral`)
      .then((response) => setSongs(response.data.songs))
      .catch((error) => console.error("Error fetching neutral songs:", error));
  }, []);

  return <SongList songs={songs} emotion="Neutral" />;
};

export default NeutralSongs;
