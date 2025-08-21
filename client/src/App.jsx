import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import EmotionDetection from './EmotionDetection';
import EmotionQuestionnaire from './components/EmotionQuestionnaire';
import LandingPage from './LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Choose from './Choose';
import HowItWorks from './HowItWorks';
import AboutUs from './AboutUs';
import History from './History';
import SongsPage from './SongPage';
import SongList from './SongList';
import Signup from "./Signup";
import Signin from "./Signin";
import AccountChoice from "./AccountChoice";
import { Toaster } from "react-hot-toast";

function AppContent() {
  const location = useLocation();

  const footerRoutes = ['/', '/how-it-works', '/about', '/songs','/account','/signin','/signup','/questionnaire', '/emotion-detection','/songlist'];
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

          {/* Dynamic route for all emotion-based song lists */}
          {/* This route will now handle all emotions, e.g., /songs/happy, /songs/sad */}
          {/* <Route path="/songs/:emotion" element={<SongList />} /> */}
          
          <Route path="/songlist" element={<SongList />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/history" element={<History />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/account" element={<AccountChoice />} />

          {/* Example of a protected route using your component */}
          {/* <Route
            path="/some-protected-page"
            element={<ProtectedRoute />}
          >
            <Route index element={<h1>Protected Content</h1>} />
          </Route> */}
        </Routes>
      </div>
      {showFooter && <Footer />}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import EmotionDetection from './EmotionDetection';
// import SadSongs from './SadSongs';
// import AngrySongs from './AngrySongs';
// import HappySongs from './HappySongs';
// import SurpriseSongs from './SurpriseSongs';
// import NeutralSongs from './NeutralSongs';
// import EmotionQuestionnaire from './components/EmotionQuestionnaire';
// import LandingPage from './LandingPage';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Choose from './Choose';
// import HowItWorks from './HowItWorks';
// import AboutUs from './AboutUs';
// // Import the dynamic SongList component
// import SongList from './SongList'; 

// function AppContent() {
//   const location = useLocation();

//   // Routes where footer should be displayed
//   const footerRoutes = ['/', '/how-it-works'];

//   // Check if current route is in footerRoutes
//   const showFooter = footerRoutes.includes(location.pathname);

//   return (
//     <>
//       <Navbar />
//       <div className="">
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/choose" element={<Choose />} />
//           <Route path="/emotion-detection" element={<EmotionDetection />} />
//           <Route path="/questionnaire" element={<EmotionQuestionnaire />} />
          
//           {/* Keep your existing static routes */}
//           <Route path="/angry-songs" element={<AngrySongs />} />
//           <Route path="/happy-songs" element={<HappySongs />} />
//           <Route path="/neutral-songs" element={<NeutralSongs />} />
//           <Route path="/sad-songs" element={<SadSongs />} />
//           <Route path="/surprise-songs" element={<SurpriseSongs />} />

//           {/* Add the dynamic route for the questionnaire results */}
//           <Route path="/songlist" element={<SongList />} />

//           <Route path="/how-it-works" element={<HowItWorks />} />
//           <Route path="/about" element={<AboutUs />} />
//         </Routes>
//       </div>
//       {showFooter && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;