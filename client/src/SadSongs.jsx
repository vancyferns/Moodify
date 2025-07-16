import React from 'react';
import './Songs.css'; // renamed import

import { FaMusic } from 'react-icons/fa';

const sadSongs = [
  { name: 'Sad Song 1', file: 'sad1.mp3' },
  { name: 'Sad Song 2', file: 'sad2.mp3' },
  { name: 'Sad Song 3', file: 'sad3.mp3' },
  { name: 'Sad Song 4', file: 'sad4.mp3' },
  { name: 'Sad Song 5', file: 'sad5.mp3' },
  { name: 'Sad Song 6', file: 'sad6.mp3' },
  { name: 'Sad Song 7', file: 'sad7.mp3' },
  { name: 'Sad Song 8', file: 'sad8.mp3' },
  { name: 'Sad Song 9', file: 'sad9.mp3' },
  { name: 'Sad Song 10', file: 'sad10.mp3' }
];

const SadSongs = () => {
  return (
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          Sad Songs For Your Mood
        </h2>
      </div>

      <div className="row px-4">
        {sadSongs.map((song, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{song.name}</h5>
                <audio controls className="w-100 mt-2">
                  <source src={`/music/sad/${song.file}`} type="audio/mpeg" />
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

export default SadSongs;
