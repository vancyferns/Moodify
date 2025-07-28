import React from 'react';
import './Songs.css'; 

const SurpriseSongsList = [];

const SurpriseSongs = () => {
  return (
    <>
      <div className="container-fluid bg-light py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold mt-5">😮Surprise Songs For Your Mood</h2>
        </div>
      </div>

      <div className="row px-4">
        {SurpriseSongsList.map((song, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              {/* <div className="card-body">
                <h5 className="card-title">{song.name}</h5>
                <audio controls className="w-100 mt-2">
                  <source src={`/music/surprise/${song.file}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NeutralSongs;