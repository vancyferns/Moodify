import React from "react";

const SongAddedModal = ({ open, onClose, songName, songArtist }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Song Added!
        </h2>
        <p className="text-gray-300 mb-6">
          <span className="font-semibold">{songName}</span> by{" "}
          <span className="font-semibold">{songArtist}</span> has been added.
        </p>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SongAddedModal;

