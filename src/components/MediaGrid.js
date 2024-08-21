import React from 'react';
import MediaCard from './MediaCard';

function MediaGrid({ mediaData, sortBy }) {
  const sortedMedia = mediaData.sort((a, b) => {
    if (sortBy === 'timestamp') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return b[sortBy] - a[sortBy];
  });

  return (
    <div className="media-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sortedMedia.map((media) => (
        <MediaCard key={media.id} media={media} />
      ))}
    </div>
  );
}

export default MediaGrid;

