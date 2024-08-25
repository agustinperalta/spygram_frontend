import React from 'react';
import '../assets/styles/MediaCard.css';

function MediaCard({ media }) {
  const mediaUrl = media.media_url ? media.media_url : media.thumbnail_url;

  return (
    <div className="card bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <div className="media-container">
        {media.media_url && ['REEL', 'VIDEO'].includes(media.media_type) ? (
          <video className="media" controls playsInline muted>
            <source src={media.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img className="media" src={mediaUrl} alt="media thumbnail" />
        )}
      </div>
      <div className="info-container p-4">
        <div className="stats-container mb-2">
          <div className="stat-item">
            <i className="fas fa-heart text-red-500"></i>
            {media.like_count || 0}
          </div>
          <div className="separator">|</div>
          <div className="stat-item">
            <i className="fas fa-comment text-blue-500"></i>
            {media.comments_count || 0}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {new Date(media.timestamp).toLocaleDateString()}
        </p>
        <div className="text-container text-sm text-gray-800">
          <p className="subtitle">{media.caption || ''}</p>
        </div>
      </div>
    </div>
  );
}

export default MediaCard;





