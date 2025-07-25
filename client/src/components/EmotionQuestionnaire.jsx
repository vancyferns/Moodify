import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EmotionQuestionnaire() {
  // State for user's text input
  const [userInput, setUserInput] = useState('');
  // State to hold the emotion returned by the API
  const [determinedEmotion, setDeterminedEmotion] = useState(null);
  // State to hold the song results from Spotify
  const [spotifyTracks, setSpotifyTracks] = useState([]);
  // State to manage the loading status during API calls
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  // State to handle any potential errors from the API
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // --- IMPORTANT: These are now read from your .env file using Vite's syntax ---
  // Make sure your .env file variables start with VITE_
  const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


  const songSuggestions = {
    happy: "hollywood and bollywood happy songs",
    sad: "comforting sad songs",
    angry: "powerful angry songs",
    stressed: "calming instrumental music",
    neutral: "relaxing chill songs",
  };

  // Function to get songs from Spotify
  const getSpotifySongs = async (emotion) => {
    setLoadingMessage('Finding perfect songs...');
    
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        setError("Spotify API credentials are not configured. Please check your .env file.");
        return;
    }

    // 1. Get Access Token from Spotify
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    };

    try {
      const authResponse = await fetch('https://accounts.spotify.com/api/token', authParameters);
      if (!authResponse.ok) {
        throw new Error('Failed to authenticate with Spotify. Check your credentials and .env setup.');
      }
      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      // 2. Search for tracks using the access token
      const searchQuery = encodeURIComponent(songSuggestions[emotion]);
      const searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=5`, searchParameters);
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch songs from Spotify.');
      }
      const searchData = await searchResponse.json();
      setSpotifyTracks(searchData.tracks.items);

    } catch (err) {
      console.error("Spotify API Error:", err);
      setError(err.message || "Sorry, we couldn't fetch songs from Spotify.");
      setSpotifyTracks([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setDeterminedEmotion(null);
    setSpotifyTracks([]);
    setError(null);
    setLoadingMessage('Analyzing Your Feeling...');

    if (!GEMINI_API_KEY) {
        setError("Gemini API key is not configured. Please check your .env file.");
        setIsLoading(false);
        return;
    }

    const prompt = `Analyze the user's sentiment from the following text. Classify the primary emotion into one of the following categories: happy, sad, angry, stressed, neutral. Respond with only the JSON object containing the emotion. Text: "${userInput}"`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: { "emotion": { "type": "STRING", "enum": ["happy", "sad", "angry", "stressed", "neutral"] } },
          required: ["emotion"]
        }
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(jsonText);
        setDeterminedEmotion(parsedJson.emotion);
        
        await getSpotifySongs(parsedJson.emotion);
      } else {
        throw new Error("Invalid response structure from API.");
      }
    } catch (err) {
      console.error("Error analyzing emotion:", err);
      setError("Sorry, we couldn't analyze your feeling. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setUserInput('');
    setDeterminedEmotion(null);
    setSpotifyTracks([]);
    setError(null);
    setIsLoading(false);
  };

  const handleGoHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white font-sans flex items-center justify-center p-4">
      <div className="relative bg-[#1a1a2e] bg-opacity-60 backdrop-blur-md border border-purple-800/50 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center transition-all duration-300">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500 blur-3xl opacity-30 rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500 blur-3xl opacity-30 rounded-full"></div>
        
        {/* <div className="absolute top-6 right-6">
          <button onClick={handleGoHome} className="text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider cursor-pointer transition-colors duration-200" aria-label="Go to Home">Home</button>
        </div> */}

        {!isLoading && !determinedEmotion && !error && (
          <form onSubmit={handleSubmit} className="relative z-10">
            <div className="mb-2 text-sm uppercase tracking-widest text-purple-400">Tell us anything</div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-4">How Are You Feeling?</h1>
            <p className="max-w-xl mx-auto text-gray-300 text-lg mb-8">Describe your mood, and our AI will find the perfect songs for you.</p>
            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="e.g., 'I had a long, frustrating day at work' or 'Feeling great and so excited for the weekend!'" className="w-full h-32 p-4 bg-[#0f0f1a] border-2 border-purple-800/60 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 mb-6 text-gray-200 placeholder-gray-500" disabled={isLoading}/>
            <button type="submit" disabled={!userInput.trim() || isLoading} className={`w-full py-3 px-8 rounded-full text-lg font-bold transition-all duration-300 ease-in-out ${userInput.trim() && !isLoading ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 transform hover:scale-105' : 'bg-gray-700 text-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-4 focus:ring-purple-500/50`}>Get My Songs!</button>
          </form>
        )}

        {isLoading && (
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold text-purple-400 animate-pulse">{loadingMessage}</h2>
          </div>
        )}

        {determinedEmotion && !isLoading && (
          <div className="results-section relative z-10">
            <p className="text-lg text-gray-300 mb-2">you're feeling:</p>
            <h2 className="text-5xl font-extrabold mb-6 capitalize bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">{determinedEmotion}</h2>
            
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-6">
              {spotifyTracks.length > 0 ? (
                spotifyTracks.map(track => (
                  <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" key={track.id} className="flex items-center p-3 bg-black bg-opacity-20 rounded-lg hover:bg-opacity-40 transition-all duration-200">
                    <img src={track.album.images[0]?.url || 'https://placehold.co/64x64/0f0f1a/333?text=?'} alt={track.name} className="w-16 h-16 rounded-md mr-4 object-cover"/>
                    <div className="text-left">
                      <p className="font-bold text-white truncate">{track.name}</p>
                      <p className="text-sm text-gray-400 truncate">{track.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                  </a>
                ))
              ) : (
                !error && <p className="text-gray-400">Could not find songs on Spotify.</p>
              )}
            </div>

            <button onClick={resetState} className="inline-block w-full max-w-sm py-3 px-8 rounded-full text-lg font-bold border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 ease-in-out">Try Again</button>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 relative z-10">
            <p className="text-xl mb-6">{error}</p>
            <button onClick={resetState} className="py-3 px-8 rounded-full text-lg font-bold border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 ease-in-out">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionQuestionnaire;
