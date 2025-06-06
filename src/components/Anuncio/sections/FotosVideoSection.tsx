// src/components/Anuncio/sections/FotosVideoSection.tsx
import React from "react";

interface FotosVideoProps {
  fotos: File[];
  setFotos: React.Dispatch<React.SetStateAction<File[]>>;
  video: File | null;
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;

  // Agora aceitamos HTMLInputElement | null
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;

  photoSlots: number;
}

const FotosVideoSection: React.FC<FotosVideoProps> = ({
  fotos,
  setFotos,
  video,
  setVideo,
  imageInputRef,
  videoInputRef,
  photoSlots,
}) => {
  const handleAddFoto = () => {
    imageInputRef.current?.click();
  };
  const handleAddVideo = () => {
    videoInputRef.current?.click();
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFotos((prev) => [...prev, file]);
    e.target.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setVideo(file);
    e.target.value = "";
  };

  return (
    <div className="modal__section" style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "4px",
        }}>
      <div className="modal__section-title">Fotos</div>
      <div className="modal__attachments">
        {Array.from({ length: photoSlots }).map((_, idx) => (
          <div
            key={idx}
            className="attachment"
            onClick={() => !fotos[idx] && handleAddFoto()}
          >
            {fotos[idx] ? (
              <img
                src={URL.createObjectURL(fotos[idx])}
                alt={`foto-${idx}`}
                className="attachment__img"
              />
            ) : (
              <span className="attachment__plus">+</span>
            )}
          </div>
        ))}
      </div>

      <div className="modal__section-title">Vídeo</div>
      <div className="modal__attachments">
        <div className="attachment" onClick={handleAddVideo}>
          {video ? (
            <video
              src={URL.createObjectURL(video)}
              controls
              className="attachment__img"
            />
          ) : (
            <span className="attachment__plus">+</span>
          )}
        </div>
      </div>

      {/* Inputs ocultos */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleFotoChange}
        style={{ display: "none" }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FotosVideoSection;
