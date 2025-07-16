import React from 'react';
import './Songs.css'; // Renamed from SadSongs.css to a generic Songs.css

const angrySongs = [
  { name: 'Angry Song 1', file: 'angry1.mp3' },
  { name: 'Angry Song 2', file: 'angry2.mp3' },
  { name: 'Angry Song 3', file: 'angry3.mp3' },
  { name: 'Angry Song 4', file: 'angry4.mp3' },
  { name: 'Angry Song 5', file: 'angry5.mp3' },
  { name: 'Angry Song 6', file: 'angry6.mp3' },
  { name: 'Angry Song 7', file: 'angry7.mp3' },
  { name: 'Angry Song 8', file: 'angry8.mp3' },
  { name: 'Angry Song 9', file: 'angry9.mp3' },
  { name: 'Angry Song 10', file: 'angry10.mp3' }
];

const AngrySongs = () => {
  return (
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">😠 Angry Songs For Your Mood</h2>
      </div>

      <div className="row px-4">
        {angrySongs.map((song, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{song.name}</h5>
                <audio controls className="w-100 mt-2">
                  <source src={`/music/angry/angry/${song.file}`} type="audio/mpeg" />
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

export default AngrySongs;
