// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import EmotionDetection from './EmotionDetection';
// import SadSongs from './SadSongs';
// import AngrySongs from './AngrySongs';
// import HappySongs from './HappySongs';
// import EmotionQuestionnaire from './components/EmotionQuestionnaire';
// import { useState, useEffect } from 'react';
// import SplashScreen from './SplashScreen'; // Adjust path if it's in a folder


// function App() {
//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowSplash(false), 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       {showSplash ? (
//         <SplashScreen onFinish={() => setShowSplash(false)} />
//       ) : (
//     <Router>
//       <Routes>
        
//         <Route path="/angry-songs" element={<AngrySongs/>}/>
//         <Route path="/sad-songs" element={<SadSongs />} />
//         <Route path="/happy-songs" element={<HappySongs/>}/>

        
//         <Route path="/emotion-detection" element={<EmotionDetection />} />
//         <Route path="/questionnaire" element={<EmotionQuestionnaire />} />
        
//         <Route path="/" element={<EmotionDetection />} />
//       </Routes>
//     </Router>
//   )}
//     </>
//   );
// }
// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmotionDetection from './EmotionDetection';
import SadSongs from './SadSongs';
import AngrySongs from './AngrySongs';
import HappySongs from './HappySongs';
import EmotionQuestionnaire from './components/EmotionQuestionnaire';
import LandingPage from './LandingPage'; // ✅ Make sure this path is correct
import Navbar from './components/Navbar';
import Choose from './Choose';

function App() {
  return (
    <Router>
      <Navbar /> {/* Global fixed navbar */}
      <div className=""> {/* Offset for fixed navbar */}
      <Routes>
        {/* 🎧 Home page with landing UI */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose" element={<Choose />} />
        {/* 🎵 Emotion Detection & Other Routes */}
        <Route path="/emotion-detection" element={<EmotionDetection />} />
        <Route path="/questionnaire" element={<EmotionQuestionnaire />} />
        <Route path="/angry-songs" element={<AngrySongs />} />
        <Route path="/sad-songs" element={<SadSongs />} />
        <Route path="/happy-songs" element={<HappySongs />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
