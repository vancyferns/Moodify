import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmotionDetection from './EmotionDetection';
import SadSongs from './SadSongs';
import AngrySongs from './AngrySongs';
import HappySongs from './HappySongs';
import EmotionQuestionnaire from './components/EmotionQuestionnaire';


function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/angry-songs" element={<AngrySongs/>}/>
        <Route path="/sad-songs" element={<SadSongs />} />
        <Route path="/happy-songs" element={<HappySongs/>}/>

        {/* New route for the questionnaire */}
        <Route path="/emotion-detection" element={<EmotionDetection />} />
        <Route path="/questionnaire" element={<EmotionQuestionnaire />} />
        {/* The default route can remain, or you can change it to questionnaire if preferred */}
        <Route path="/" element={<EmotionDetection />} />
      </Routes>
    </Router>
  );
}

export default App;
