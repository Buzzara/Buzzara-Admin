import React from "react";

interface FotosVideoProps {
  fotos: File[];
  setFotos: React.Dispatch<React.SetStateAction<File[]>>;
  video: File | null;
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
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

  const handleRemoveFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = () => {
    setVideo(null);
  };

  return (
    <div
      className="modal__section"
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}
    >
      <div className="modal__section-title">Fotos</div>
      <div className="modal__attachments">
        {Array.from({ length: photoSlots }).map((_, idx) => (
          <div key={idx} className="attachment" style={{ position: "relative" }}>
            {fotos[idx] ? (
              <>
                <img
                  src={URL.createObjectURL(fotos[idx])}
                  alt={`foto-${idx}`}
                  className="attachment__img"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFoto(idx)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                    lineHeight: "20px",
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <div onClick={handleAddFoto}>
                <span className="attachment__plus">+</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="modal__section-title">Vídeo</div>
      <div className="modal__attachments">
        <div className="attachment" style={{ position: "relative" }}>
          {video ? (
            <>
              <video
                src={URL.createObjectURL(video)}
                controls
                className="attachment__img"
              />
              <button
                type="button"
                onClick={handleRemoveVideo}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                ×
              </button>
            </>
          ) : (
            <div onClick={handleAddVideo}>
              <span className="attachment__plus">+</span>
            </div>
          )}
        </div>
      </div>

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
