import React, { useRef, useState, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import "../styles/photoPage.scss";
import { enviarFotoAnuncio } from "../services/anuncio/enviarFotoAnuncio";

const MAX_PHOTOS = 4;

const PhotoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const anuncioId = Number(id);

  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUploadClick = () => {
    console.log("⏩ handlePhotoUploadClick", {
      currentCount: photos.length,
      max: MAX_PHOTOS,
      uploading,
    });
    if (photos.length < MAX_PHOTOS && !uploading) {
      photoInputRef.current?.click();
    }
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("📸 handlePhotoChange triggered", { files });
    if (!files || files.length === 0) return;

    setUploading(true);
    console.log("🔄 Iniciando upload de fotos...", {
      totalSelected: files.length,
    });

    const remaining = MAX_PHOTOS - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);
    console.log(
      `🔢 Você pode enviar até ${remaining} arquivos. Enviando ${toUpload.length}.`
    );

    for (const file of toUpload) {
      console.log("➡️ enviando arquivo:", file.name, file.type, file.size);
      try {
        const res = await enviarFotoAnuncio({ id: anuncioId, file });
        console.log("✅ upload bem-sucedido:", res);
        setPhotos((prev) => {
          const updated = [...prev, res.url];
          console.log("📥 estado photos atualizado:", updated);
          return updated;
        });
      } catch (err) {
        console.error("❌ erro ao enviar foto:", err);
      }
    }

    e.target.value = "";
    setUploading(false);
    console.log("🏁 uploads finalizados, uploading = false");
  };

  const handlePaidPlanClick = () => {
    console.log("🔒 tentou adicionar vídeo, redirecionar para plano pago");
    alert("Para adicionar mais vídeos, adquira um plano pago.");
  };

  const renderPhotoCards = () => {
    const cards = [];
    for (let i = 0; i < MAX_PHOTOS; i++) {
      if (i < photos.length) {
        cards.push(
          <div key={i} className="photo-card">
            <img src={photos[i]} alt={`Foto ${i + 1}`} />
          </div>
        );
      } else {
        cards.push(
          <div
            key={i}
            className={`photo-card add-photo ${uploading ? "disabled" : ""}`}
            onClick={handlePhotoUploadClick}
          >
            <div className="plus-icon">+</div>
            <p>Adicionar Foto</p>
          </div>
        );
      }
    }
    return cards;
  };

  return (
    <div className="photo-page">
      <h1>Minhas Fotos</h1>

      <div className="photo-grid">{renderPhotoCards()}</div>

      <div className="blur-section" onClick={handlePaidPlanClick}>
        <Lock size={32} className="lock-icon" />
        <p>
          Para adicionar mais vídeos, será necessário adquirir um plano pago.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={photoInputRef}
        onChange={handlePhotoChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default PhotoPage;
