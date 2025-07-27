import React from 'react';
import './Songs.css'; // updated import path

const happySongs = [
  { name: 'Happy Song 1', file: 'happy1.mp3' },
  { name: 'Happy Song 2', file: 'happy2.mp3' },
  { name: 'Happy Song 3', file: 'happy3.mp3' },
  { name: 'Happy Song 4', file: 'happy4.mp3' },
  { name: 'Happy Song 5', file: 'happy5.mp3' },
  { name: 'Happy Song 6', file: 'happy6.mp3' },
  { name: 'Happy Song 7', file: 'happy7.mp3' },
  { name: 'Happy Song 8', file: 'happy8.mp3' },
  { name: 'Happy Song 9', file: 'happy9.mp3' },
  { name: 'Happy Song 10', file: 'happy10.mp3' }
];

const HappySongs = () => {
  return (
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold mt-5">😊Happy Songs For Your Mood</h2>
      </div>

      <div className="row px-4">
        {happySongs.map((song, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{song.name}</h5>
                <audio controls className="w-100 mt-2">
                  <source src={`/music/happy/happy/${song.file}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HappySongs;
