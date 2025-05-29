// src/components/EditAnuncioModal/EditAnuncioModal.tsx
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
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState<number>(0);
  const [categoria, setCategoria] = useState("");
  const [lugarEncontro, setLugarEncontro] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [existingFotos, setExistingFotos] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fotoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Quando o modal abre ou o anúncio muda, popula os estados
  useEffect(() => {
    if (!isOpen) return;
    setNome(anuncio.nome);
    setDescricao(anuncio.descricao);
    setPreco(anuncio.preco);
    setCategoria(anuncio.categoria);
    setLugarEncontro(anuncio.lugarEncontro);
    setExistingFotos(anuncio.fotos);
    setExistingVideos(anuncio.video ? [anuncio.video] : []);
    setFotos([]);
    setVideos([]);
    setError(null);
  }, [isOpen, anuncio]);

  const handleAddFoto = () => fotoInputRef.current?.click();
  const handleAddVideo = () => videoInputRef.current?.click();

  // Converte FileList em File[] sem erro de tipagem
  const onFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i);
      if (f) arr.push(f);
    }
    setFotos(prev => [...prev, ...arr]);
    e.target.value = "";
  };

  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const v = files.item(i);
      if (v) arr.push(v);
    }
    setVideos(prev => [...prev, ...arr]);
    e.target.value = "";
  };

  const removeExistingFoto = (url: string) =>
    setExistingFotos(prev => prev.filter(u => u !== url));
  const removeNewFoto = (idx: number) =>
    setFotos(prev => prev.filter((_, i) => i !== idx));

  const removeExistingVideo = (url: string) =>
    setExistingVideos(prev => prev.filter(u => u !== url));
  const removeNewVideo = (idx: number) =>
    setVideos(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("nome", nome);
      form.append("descricao", descricao);
      form.append("preco", preco.toString());
      form.append("Categoria", categoria);
      form.append("LugarEncontro", lugarEncontro);

      existingFotos.forEach(url => form.append("existingFotos", url));
      fotos.forEach(file => form.append("newFotos", file));

      existingVideos.forEach(url => form.append("existingVideos", url));
      videos.forEach(file => form.append("newVideos", file));

      const { data } = await api.put<AnuncioResponse>(
        `/anuncios/${anuncio.id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onSuccess(data);
      onClose();
    } catch (err: any) {
      console.error("Erro ao editar anúncio:", err.response?.data || err);
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" | ")
        : err.response?.data?.message || "Erro inesperado";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
              onChange={e => setNome(e.target.value)}
              required
            />
          </label>

          <label className="modal__label">
            Descrição
            <textarea
              className="modal__textarea"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required
            />
          </label>

          <label className="modal__label">
            Preço
            <input
              type="number"
              step="0.01"
              className="modal__input"
              value={preco}
              onChange={e => setPreco(Number(e.target.value))}
              required
            />
          </label>

          <label className="modal__label">
            Categoria
            <select
              className="modal__input"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              <option value="Acompanhante">Acompanhante</option>
              <option value="Mensagens Eróticas">Mensagens Eróticas</option>
              <option value="Vídeo Chamadas">Vídeo Chamadas</option>
              <option value="Sexting">Sexting</option>
            </select>
          </label>

          <label className="modal__label">
            Local de Encontro
            <input
              className="modal__input"
              value={lugarEncontro}
              onChange={e => setLugarEncontro(e.target.value)}
              required
            />
          </label>

          {/* Fotos Existentes */}
          <div className="modal__section">
            <div className="modal__section-title">Fotos Existentes</div>
            <div className="modal__attachments">
              {existingFotos.map(url => (
                <div key={url} className="attachment">
                  <img src={url} alt="Foto" />
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

          {/* Adicionar Fotos */}
          <div className="modal__section">
            <div className="modal__section-title">Adicionar Fotos</div>
            <div className="modal__attachments">
              {fotos.map((file, i) => {
                const preview = URL.createObjectURL(file);
                return (
                  <div key={`${file.name}-${i}`} className="attachment">
                    <img src={preview} alt="Nova foto" />
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
              <button
                type="button"
                className="attachment add"
                onClick={handleAddFoto}
              >
                +
              </button>
            </div>
          </div>

          {/* Vídeos Existentes */}
          <div className="modal__section">
            <div className="modal__section-title">Vídeos Existentes</div>
            <div className="modal__attachments">
              {existingVideos.map(url => (
                <div key={url} className="attachment">
                  <video src={url} controls />
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

          {/* Adicionar Vídeos */}
          <div className="modal__section">
            <div className="modal__section-title">Adicionar Vídeos</div>
            <div className="modal__attachments">
              {videos.map((file, i) => {
                const preview = URL.createObjectURL(file);
                return (
                  <div key={`${file.name}-${i}`} className="attachment">
                    <video src={preview} controls />
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
              <button
                type="button"
                className="attachment add"
                onClick={handleAddVideo}
              >
                +
              </button>
            </div>
          </div>

          <input
            ref={fotoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFotoChange}
            style={{ display: "none" }}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
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
