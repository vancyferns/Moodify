import React, { useEffect, useState } from "react";
import axios from "axios";
import SongList from "./SongList";
import { API_BASE_URL } from "./config";

const HappySongs = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/songs/happy`)
      .then((response) => setSongs(response.data.songs))
      .catch((error) => console.error("Error fetching happy songs:", error));
  }, []);

  return <SongList songs={songs} emotion="Happy" />;
};

export default HappySongs;
