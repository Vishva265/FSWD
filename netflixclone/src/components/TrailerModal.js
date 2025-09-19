import React from "react";
import "./TrailerModal.css";

function TrailerModal({ show, trailerUrl, onClose }) {
  if (!show) return null;
  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="modal_content" onClick={e => e.stopPropagation()}>
        <iframe
          width="100%"
          height="400"
          src={trailerUrl}
          title="Trailer"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
        <button className="close_button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default TrailerModal;
