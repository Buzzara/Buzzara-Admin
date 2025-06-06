import React, { useState, useEffect, ChangeEvent } from "react";
import type {
  EditarAnuncioResponse,
  EditarAnuncioParams,
} from "../../types/anuncio/useEditarAnuncio";
import { editarAnuncio } from "../../services/anuncio/editarAnuncio";
import "./EditAnuncioModal.scss";

const weekdayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];
function getWeekdayName(dateString: string): string {
  if (!dateString) return "";
  const [Y, M, D] = dateString.split("-").map(Number);
  return weekdayNames[new Date(Y, M - 1, D).getDay()] || "";
}

interface EditAnuncioModalProps {
  isOpen: boolean;
  anuncio: EditarAnuncioResponse;
  onClose: () => void;
  onSuccess: (atualizado: EditarAnuncioResponse) => void;
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

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const [fotos, setFotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setNome(anuncio.nome);
    setDescricao(anuncio.descricao);
    setPreco(anuncio.preco);
    setCategoria(anuncio.categoria);
    setLugarEncontro(anuncio.lugarEncontro);

    setDataInicio("");
    setDataFim("");
    setHoraInicio("");
    setHoraFim("");

    setFotos([]);
    setVideos([]);
    setError(null);
  }, [isOpen, anuncio]);

  const onFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFotos((prev) => {
      const combined = [...prev, ...newFiles].slice(0, 4);
      return combined;
    });
    e.target.value = "";
  };

  const onVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setVideos([e.target.files[0]]);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const diaIn = getWeekdayName(dataInicio);
      const diaFm = getWeekdayName(dataFim);
      const disponibilidade = `${diaIn} até ${diaFm}, horário: ${horaInicio} às ${horaFim}`;

      const params: EditarAnuncioParams = {
        nome,
        descricao,
        preco,
        categoria,
        lugarEncontro,
        disponibilidade,
      };
      if (fotos.length) params.novasFotos = fotos;
      if (videos.length) params.novoVideo = videos[0];

      const updated = await editarAnuncio(anuncio.servicoID, params);
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      console.error("Erro ao editar anúncio:", err);
      setError("Não foi possível salvar. Tente novamente.");
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
              step="0.01"
              className="modal__input"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              required
            />
          </label>

          <label className="modal__label">
            Categoria
            <select
              className="modal__input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
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
              onChange={(e) => setLugarEncontro(e.target.value)}
              required
            />
          </label>

          <div className="modal__section">
            <div className="modal__section-title">Disponibilidade</div>
            <div className="modal__availability-grid">
              <label className="modal__label">
                Data Início
                <input
                  type="date"
                  className="modal__input"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />
              </label>
              <label className="modal__label">
                Data Fim
                <input
                  type="date"
                  className="modal__input"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  required
                />
              </label>
              <label className="modal__label">
                Hora Início
                <input
                  type="time"
                  className="modal__input"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
              </label>
              <label className="modal__label">
                Hora Fim
                <input
                  type="time"
                  className="modal__input"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>

          <div className="modal__section">
            <div className="modal__attachments">
              {fotos.map((file, idx) => {
                const preview = URL.createObjectURL(file);
                return (
                  <div key={idx} className="attachment">
                    <img src={preview} alt={`Foto ${idx + 1}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        setFotos((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
              {fotos.length < 4 && (
                <label className="attachment add">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onFotoChange}
                    style={{ display: "none" }}
                  />
                  +
                </label>
              )}
            </div>
          </div>

          <div className="modal__section">
            <div className="modal__section-title">Adicionar Vídeo</div>
            <div className="modal__attachments">
              {videos.map((file, idx) => {
                const preview = URL.createObjectURL(file);
                return (
                  <div key={idx} className="attachment">
                    <video src={preview} controls />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => setVideos([])}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
              {videos.length === 0 && (
                <label className="attachment add">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={onVideoChange}
                    style={{ display: "none" }}
                  />
                  +
                </label>
              )}
            </div>
          </div>

          <button type="submit" className="modal__submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
