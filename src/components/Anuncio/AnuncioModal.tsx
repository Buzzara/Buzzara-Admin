// src/Anuncio/NewAnuncioModal.tsx
import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { AnuncioResponse } from "../../types/userAnuncio";
import "./NewAnuncioModal.scss";
import { Estado } from "../../types/useEstado";

interface NewAnuncioModalProps {
  isOpen: boolean;
  servicoID: number;
  onClose: () => void;
  onSuccess: (anuncio: AnuncioResponse) => void;
}

const NewAnuncioModal: React.FC<NewAnuncioModalProps> = ({
  isOpen,
  servicoID,
  onClose,
  onSuccess,
}) => {
  // estados
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState<number>(0);
  const [categoria, setCategoria] = useState("Acompanhante");
  const [lugarEncontro, setLugarEncontro] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [peso, setPeso] = useState<number | "">("");
  const [altura, setAltura] = useState<number | "">("");
  const [disponibilidadeDataInicio, setDisponibilidadeDataInicio] =
    useState("");
  const [disponibilidadeDataFim, setDisponibilidadeDataFim] = useState("");
  const [disponibilidadeHoraInicio, setDisponibilidadeHoraInicio] =
    useState("");
  const [disponibilidadeHoraFim, setDisponibilidadeHoraFim] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [photoSlots, setPhotoSlots] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [estados, setEstados] = useState<Estado[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.warn("Erro ao obter localização:", error);
        }
      );
    }
  }, []);

useEffect(() => {
  const fetchEstados = async () => {
    try {
      const url = import.meta.env.VITE_API_IBGE_ESTADOS;
      console.log("🌐 URL da API:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("📦 Dados recebidos:", data);

      const estadosOrdenados = data.sort((a: Estado, b: Estado) =>
        a.nome.localeCompare(b.nome)
      );
      setEstados(estadosOrdenados);
    } catch (err) {
      console.error("❌ Erro ao buscar estados:", err);
    }
  };

  fetchEstados();
}, []);


  // refs para input hidden
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // abre o seletor de arquivos
  const handleAddFoto = () => imageInputRef.current?.click();
  const handleAddVideo = () => videoInputRef.current?.click();

  // recebe a foto e adiciona ao array
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

  const handleLoadMorePhotos = () => setPhotoSlots((prev) => prev + 4);

const getWeekdayName = (dateString: string) => {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const form = new FormData();
    form.append("servicoID", servicoID.toString());
    form.append("nome", nome);
    form.append("descricao", descricao);
    form.append("preco", preco.toString());
    form.append("categoria", categoria);
    form.append("lugarEncontro", lugarEncontro);

    if (idade !== "") form.append("idade", String(idade));
    if (peso !== "") form.append("peso", String(peso));
    if (altura !== "") form.append("altura", String(altura));

    form.append("dataCriacao", new Date().toISOString());

    let disponibilidade = "";
    if (
      disponibilidadeDataInicio &&
      disponibilidadeDataFim &&
      disponibilidadeHoraInicio &&
      disponibilidadeHoraFim
    ) {
      const diaInicio = getWeekdayName(disponibilidadeDataInicio);
      const diaFim = getWeekdayName(disponibilidadeDataFim);

      disponibilidade =
        diaInicio === diaFim
          ? `${diaInicio}, horário: ${disponibilidadeHoraInicio} às ${disponibilidadeHoraFim}`
          : `${diaInicio} até ${diaFim}, horário: ${disponibilidadeHoraInicio} às ${disponibilidadeHoraFim}`;

      form.append("disponibilidade", disponibilidade);
    }

    form.append("endereco", endereco);
    form.append("cidade", cidade);
    form.append("estado", estado);
    form.append("bairro", bairro);
    if (latitude !== null) form.append("latitude", latitude.toString());
    if (longitude !== null) form.append("longitude", longitude.toString());

    fotos.forEach((file) => form.append("Fotos", file));
    if (video) form.append("Video", video);

    const { data: anuncio } = await api.post<AnuncioResponse>("/anuncios", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    onSuccess(anuncio);
    onClose();
  } catch (err: any) {
    const message = err.response?.data?.error || err.message;
    console.error("Erro ao criar anúncio:", message);
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title">Novo Anúncio</h2>

        {error && <div className="modal__error">{error}</div>}

        <div className="modal__body">
          <form className="modal__form" onSubmit={handleSubmit}>
            {/* campos textuais */}
            <label className="modal__label">
              Nome do Anúncio
              <input
                type="text"
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

            {/* Endereço */}
            <label className="modal__label">
              Endereço
              <input
                type="text"
                className="modal__input"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </label>
            <label className="modal__label">
              Cidade
              <input
                type="text"
                className="modal__input"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              />
            </label>
            <label className="modal__label">
              Estado
              <select
                className="modal__input"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              >
                <option value="">Selecione o estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="modal__label">
              Bairro
              <input
                type="text"
                className="modal__input"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
              />
            </label>

            <label className="modal__label">
              Preço (R$)
              <input
                type="number"
                className="modal__input"
                value={preco}
                onChange={(e) => setPreco(parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            </label>

            <label className="modal__label">
              Categoria
              <select
                className="modal__input"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option>Acompanhante</option>
                <option>Mensagens Eróticas</option>
                <option>Vídeo Chamadas</option>
                <option>Sexting</option>
              </select>
            </label>

            <label className="modal__label">
              Lugar de Encontro
              <input
                type="text"
                className="modal__input"
                value={lugarEncontro}
                onChange={(e) => setLugarEncontro(e.target.value)}
                required
              />
            </label>

            <label className="modal__label">
              Idade
              <input
                type="number"
                className="modal__input"
                value={idade}
                onChange={(e) =>
                  setIdade(
                    e.target.value === "" ? "" : parseInt(e.target.value, 10)
                  )
                }
                min="18"
                required
              />
            </label>

            <label className="modal__label">
              Peso (kg)
              <input
                type="number"
                className="modal__input"
                value={peso}
                onChange={(e) =>
                  setPeso(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                min="0"
                step="0.1"
              />
            </label>

            <label className="modal__label">
              Altura (cm)
              <input
                type="number"
                className="modal__input"
                value={altura}
                onChange={(e) =>
                  setAltura(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                min="0"
                step="0.1"
              />
            </label>

            {/* disponibilidade */}
            <div className="modal__section">
              <div className="modal__section-title">Disponibilidade</div>
              <div className="modal__availability">
                <div>
                  <label className="modal__label">Data Início</label>
                  <input
                    type="date"
                    className="modal__input"
                    value={disponibilidadeDataInicio}
                    onChange={(e) =>
                      setDisponibilidadeDataInicio(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="modal__label">Data Fim</label>
                  <input
                    type="date"
                    className="modal__input"
                    value={disponibilidadeDataFim}
                    onChange={(e) => setDisponibilidadeDataFim(e.target.value)}
                  />
                </div>
                <div>
                  <label className="modal__label">Hora Início</label>
                  <input
                    type="time"
                    className="modal__input"
                    value={disponibilidadeHoraInicio}
                    onChange={(e) =>
                      setDisponibilidadeHoraInicio(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="modal__label">Hora Fim</label>
                  <input
                    type="time"
                    className="modal__input"
                    value={disponibilidadeHoraFim}
                    onChange={(e) => setDisponibilidadeHoraFim(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* anexos de fotos */}
            <div className="modal__section">
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
                {fotos.length === photoSlots && (
                  <button
                    type="button"
                    className="modal__load-more"
                    onClick={handleLoadMorePhotos}
                  >
                    Ver mais
                  </button>
                )}
              </div>
            </div>

            {/* anexo de vídeo */}
            <div className="modal__section">
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
            </div>

            {/* inputs ocultos */}
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

            <button
              type="submit"
              className="modal__submit"
              disabled={loading || (fotos.length === 0 && !video)}
            >
              {loading ? "Enviando..." : "Criar Anúncio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAnuncioModal;
