import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import AboutUs from './AboutUs';

function AppContent() {
  const location = useLocation();

  // Routes where footer should be displayed
  const footerRoutes = ['/', '/how-it-works'];

  // Check if current route is in footerRoutes
  const showFooter = footerRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <div className="">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/emotion-detection" element={<EmotionDetection />} />
          <Route path="/questionnaire" element={<EmotionQuestionnaire />} />
          <Route path="/angry-songs" element={<AngrySongs />} />
          <Route path="/happy-songs" element={<HappySongs />} />
          <Route path="/neutral-songs" element={<NeutralSongs />} />
          <Route path="/sad-songs" element={<SadSongs />} />
          <Route path="/surprise-songs" element={<SurpriseSongs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
