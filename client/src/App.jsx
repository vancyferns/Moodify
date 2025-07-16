// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmotionDetection from './EmotionDetection';
import SadSongs from './SadSongs';
import AngrySongs from './AngrySongs';
import HappySongs from './HappySongs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/angry-songs" element={<AngrySongs/>}/>
        <Route path="/" element={<EmotionDetection />} />
        <Route path="/sad-songs" element={<SadSongs />} />
        <Route path="/happy-songs" element={<HappySongs/>}/>
      </Routes>
    </Router>
  );
}

export default App;
