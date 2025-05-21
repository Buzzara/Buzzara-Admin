import React, { useRef, useState, ChangeEvent } from 'react';
import { Lock } from 'lucide-react';
import '../styles/videoPage.scss';

const VideoPage: React.FC = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const MAX_VIDEOS = 4;

  const handleVideoUploadClick = () => {
    if (videos.length < MAX_VIDEOS) {
      videoInputRef.current?.click();
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newVideos: string[] = [];
      const remainingSlots = MAX_VIDEOS - videos.length;
      const filesToAdd = Math.min(files.length, remainingSlots);

      for (let i = 0; i < filesToAdd; i++) {
        const file = files[i];
        const videoUrl = URL.createObjectURL(file);
        newVideos.push(videoUrl);
      }
      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    }
  };

  const handlePaidPlanClick = () => {
    alert('Clique detectado: Redirecionando para a página de planos pagos.');
    // redirecionamento ou modal aqui
  };

  const renderVideoCards = () => {
    const cards = [];
    for (let i = 0; i < MAX_VIDEOS; i++) {
      if (i < videos.length) {
        cards.push(
          <div key={i} className="video-card">
            <video controls src={videos[i]} />
          </div>
        );
      } else {
        cards.push(
          <div
            key={i}
            className="video-card add-video"
            onClick={handleVideoUploadClick}
          >
            <div className="plus-icon">+</div>
            <p>Adicionar Vídeo</p>
          </div>
        );
      }
    }
    return cards;
  };

  return (
    <div className="video-page">
      <h1>Meus Vídeos</h1>

      <div className="video-grid">{renderVideoCards()}</div>

      {/* Seção inferior com efeito de vidro clicável e ícone de cadeado acima do texto */}
      <div className="blur-section" onClick={handlePaidPlanClick}>
        <Lock size={32} className="lock-icon" />
        <p>
          Para adicionar mais vídeos, será necessário adquirir um plano pago.
        </p>
      </div>

      <input
        type="file"
        accept="video/*"
        multiple
        ref={videoInputRef}
        onChange={handleVideoChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VideoPage;
