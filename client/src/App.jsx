
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import EmotionDetection from './EmotionDetection';
// import SadSongs from './SadSongs';
// import AngrySongs from './AngrySongs';
// import HappySongs from './HappySongs';
// import SurpriseSongs from './SurpriseSongs';

// import EmotionQuestionnaire from './components/EmotionQuestionnaire';
// import LandingPage from './LandingPage';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// import Choose from './Choose';
// import HowItWorks from './HowItWorks'; // ✅ New Import

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="">
//         <Routes>
//           {/* 🎧 Home page with landing UI */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/choose" element={<Choose />} />
          
//           {/* 🧠 Emotion Detection */}
//           <Route path="/emotion-detection" element={<EmotionDetection />} />
//           <Route path="/questionnaire" element={<EmotionQuestionnaire />} />

//           {/* 🎵 Music Categories */}
//           <Route path="/angry-songs" element={<AngrySongs />} />
//           <Route path="/sad-songs" element={<SadSongs />} />
//           <Route path="/happy-songs" element={<HappySongs />} />
//           <Route path="/surprise-songs" element={<SurpriseSongs />} />
//           <Route path="/HowItWorks" element={<HowItWorks />} />
//         </Routes>
//       </div>
//       <Footer /> {/* ✅ Add Footer below routes */}
//     </Router>
//   );
// }

// export default App;
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmotionDetection from './EmotionDetection';
import SadSongs from './SadSongs';
import AngrySongs from './AngrySongs';
import HappySongs from './HappySongs';
import SurpriseSongs from './SurpriseSongs';
import NeutralSongs from './NeutralSongs';
import EmotionQuestionnaire from './components/EmotionQuestionnaire';
import LandingPage from './LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Choose from './Choose';
import HowItWorks from './HowItWorks';
import AboutUs from './AboutUs'; // ✅ NEW IMPORT

function App() {
  return (
    <Router>
      <Navbar />
      <div className="">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/emotion-detection" element={<EmotionDetection />} />
          <Route path="/questionnaire" element={<EmotionQuestionnaire />} />
          <Route path="/angry-songs" element={<AngrySongs />} />
          <Route path="/sad-songs" element={<SadSongs />} />
          <Route path="/happy-songs" element={<HappySongs />} />
                     <Route path="/surprised-songs" element={<SurpriseSongs />} />
                                          <Route path="/neutral-songs" element={<NeutralSongs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<AboutUs />} /> {/* ✅ NEW ROUTE */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
