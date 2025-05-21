import React from 'react';
import './VideoGrid.scss';

export type VideoItem = {
  id: string;
  title: string;
};

interface VideoGridProps {
  videos: VideoItem[];
  onSelectVideo: (videoId: string) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onSelectVideo }) => {
  return (
    <div className="videoGrid">
      {videos.map((video) => (
        <div
          key={video.id}
          className="videoCard"
          onClick={() => onSelectVideo(video.id)}
        >
          <div className="plusWrapper">
            {/* Ícone de “+” atualizado para SVG */}
            <svg
              className="plusIcon"
              xmlns="http://www.w3.org/2000/svg"
              fill="#666"
              viewBox="0 0 24 24"
              width="48px"
              height="48px"
            >
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </div>
          <p className="videoTitle">{video.title}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
