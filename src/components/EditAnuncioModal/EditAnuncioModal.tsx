import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { AnuncioResponse } from "../../types/userAnuncio";
import "./EditAnuncioModal.scss";

interface EditAnuncioModalProps {
  isOpen: boolean;
  anuncio: AnuncioResponse;
  onClose: () => void;
  onSuccess: (atualizado: AnuncioResponse) => void;
}

export default function EditAnuncioModal({
  isOpen,
  anuncio,
  onClose,
  onSuccess,
}: EditAnuncioModalProps) {
  const [nome, setNome] = useState(anuncio.nome);
  const [descricao, setDescricao] = useState(anuncio.descricao);
  const [preco, setPreco] = useState<number>(anuncio.preco);
  const [fotos, setFotos] = useState<File[]>([]);           // novos arquivos
  const [videos, setVideos] = useState<File[]>([]);
  const [existingFotos, setExistingFotos] = useState<string[]>(anuncio.fotos);
  const [existingVideos, setExistingVideos] = useState<string[]>(
    anuncio.video ? [anuncio.video] : []
  );
  const [removedFotos, setRemovedFotos] = useState<string[]>([]);
  const [removedVideos, setRemovedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fotoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNome(anuncio.nome);
      setDescricao(anuncio.descricao);
      setPreco(anuncio.preco);
      setExistingFotos(anuncio.fotos);
      setExistingVideos(anuncio.video ? [anuncio.video] : []);
      setFotos([]);
      setVideos([]);
      setRemovedFotos([]);
      setRemovedVideos([]);
      setError(null);
    }
  }, [isOpen, anuncio]);

  if (!isOpen) return null;

  const handleAddFoto = () => fotoInputRef.current?.click();
  const handleAddVideo = () => videoInputRef.current?.click();

  const onFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFotos((f) => [...f, e.target.files![0]]);
    }
    e.target.value = "";
  };
  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setVideos((v) => [...v, e.target.files![0]]);
    }
    e.target.value = "";
  };

  const removeExistingFoto = (url: string) => {
    setExistingFotos((f) => f.filter((u) => u !== url));
    setRemovedFotos((r) => [...r, url]);
  };
  const removeNewFoto = (idx: number) => {
    setFotos((f) => f.filter((_, i) => i !== idx));
  };

  const removeExistingVideo = (url: string) => {
    setExistingVideos((v) => v.filter((u) => u !== url));
    setRemovedVideos((r) => [...r, url]);
  };
  const removeNewVideo = (idx: number) => {
    setVideos((v) => v.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("nome", nome);
      form.append("descricao", descricao);
      form.append("preco", preco.toString());
      form.append("removedFotos", JSON.stringify(removedFotos));
      form.append("removedVideos", JSON.stringify(removedVideos));

      fotos.forEach((f) => form.append("newFotos", f));
      videos.forEach((v) => form.append("newVideos", v));

      const { data } = await api.put<AnuncioResponse>(
        `/anuncios/${anuncio.id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onSuccess(data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title">Editar Anúncio</h2>

        {error && <div className="modal__error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal__form">
          <label className="modal__label">
            Nome
            <input
              className="modal__input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>
          <label className="modal__label">
            Descrição
            <textarea
              className="modal__textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </label>
          <label className="modal__label">
            Preço
            <input
              type="number"
              className="modal__input"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              min={0}
              required
            />
          </label>

          {/* Fotos Existentes */}
          <div className="modal__section">
            <div className="modal__section-title">Fotos Existentes</div>
            <div className="modal__attachments">
              {existingFotos.map((url) => (
                <div key={url} className="attachment">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt="Foto" />
                  </a>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExistingFoto(url)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Novas Fotos */}
          <div className="modal__section">
            <div className="modal__section-title">Adicionar Fotos</div>
            <div className="modal__attachments">
              {fotos.map((f, i) => {
                const preview = URL.createObjectURL(f);
                return (
                  <div key={i} className="attachment">
                    <a href={preview} target="_blank" rel="noopener noreferrer">
                      <img src={preview} alt="Nova foto" />
                    </a>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeNewFoto(i)}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
              <div className="attachment add" onClick={handleAddFoto}>
                +
              </div>
            </div>
          </div>

          {/* Vídeos Existentes */}
          <div className="modal__section">
            <div className="modal__section-title">Vídeos Existentes</div>
            <div className="modal__attachments">
              {existingVideos.map((url) => (
                <div key={url} className="attachment">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <video src={url} />
                  </a>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExistingVideo(url)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Novos Vídeos */}
          <div className="modal__section">
            <div className="modal__section-title">Adicionar Vídeos</div>
            <div className="modal__attachments">
              {videos.map((v, i) => {
                const preview = URL.createObjectURL(v);
                return (
                  <div key={i} className="attachment">
                    <a
                      href={preview}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <video src={preview} />
                    </a>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeNewVideo(i)}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
              <div className="attachment add" onClick={handleAddVideo}>
                +
              </div>
            </div>
          </div>

          <input
            ref={fotoInputRef}
            type="file"
            accept="image/*"
            onChange={onFotoChange}
            style={{ display: "none" }}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={onVideoChange}
            style={{ display: "none" }}
          />

          <button
            type="submit"
            className="modal__submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
