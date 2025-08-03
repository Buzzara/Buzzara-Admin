import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import Modal from "react-modal";
import "./cropper-modal.scss";

interface Props {
  image: string;
  onCancel: () => void;
  onCropComplete: (cropped: Blob) => void;
}

const CropperModal: React.FC<Props> = ({ image, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    if (croppedImage) onCropComplete(croppedImage);
  };

  return (
    <Modal isOpen onRequestClose={onCancel} contentLabel="Editar Capa" className="cropper-modal" overlayClassName="cropper-overlay">
      <div className="cropper-container">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={3 / 1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>
      <div className="cropper-controls">
        <label>Zoom</label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <div className="buttons">
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={handleDone}>Salvar recorte</button>
        </div>
      </div>
    </Modal>
  );
};

export default CropperModal;
