import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Edit,
  Trash2,
  PlusCircle,
  Search,
  ChevronDown,
  Play,
} from "lucide-react";

import NewAnuncioModal from "../components/Anuncio/AnuncioModal";
import EditAnuncioModal from "../components/EditAnuncioModal/EditAnuncioModal";

import { buscarAnuncio } from "../services/anuncio/buscarAnuncio";
import { deletarAnuncio } from "../services/anuncio/deletarAnuncio";

import type { EditarAnuncioResponse } from "../types/anuncio/useEditarAnuncio";

import "../styles/anunciosPage.scss";
import { CriarAnuncioResponse } from "../types/anuncio/useCriarAnuncio";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface Anuncio {
  id: string;
  title: string;
  descricao: string;
  preco: number;
  status: "Ativo" | "Pausado" | "Expirado";
  rawDate: string;
  createdAt: string;
  fotos: { fotoAnuncioID: number; url: string }[];
  videos: { videoAnuncioID: number; url: string }[];
  categoria: string;
  lugarEncontro: string;
}

function getMediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001"
      : "https://api.buzzara.com.br";
  return `${baseUrl}${clean}`;
}

const CardCarousel: React.FC<{ mediaItems: MediaItem[] }> = ({
  mediaItems,
}) => {
  const [current, setCurrent] = useState(0);
  const length = mediaItems.length;
  const next = () => setCurrent((p) => (p + 1) % length);
  const prev = () => setCurrent((p) => (p - 1 + length) % length);

  if (length === 0) return null;
  const media = mediaItems[current];

  return (
    <div className="card__carousel">
      <div className="card__carousel-main">
        {media.type === "video" ? (
          <div className="video-wrapper">
            <video
              controls
              src={getMediaUrl(media.url)}
              className="card__img"
            />
            <div className="video-banner">
              <Play size={48} />
            </div>
          </div>
        ) : (
          <img
            src={getMediaUrl(media.url)}
            alt="preview"
            className="card__img"
          />
        )}
        {length > 1 && (
          <>
            <button
              className="carousel__btn carousel__btn--prev"
              onClick={prev}
            >
              &larr;
            </button>
            <button
              className="carousel__btn carousel__btn--next"
              onClick={next}
            >
              &rarr;
            </button>
          </>
        )}
      </div>
      {length > 1 && (
        <div className="carousel__thumbs-container">
          <button
            className="carousel__thumb-btn carousel__thumb-btn--prev"
            onClick={prev}
          >
            &larr;
          </button>
          <div className="carousel__thumbs">
            {mediaItems.map((m, idx) => (
              <div
                key={idx}
                className={`carousel__thumb ${idx === current ? "active" : ""}`}
                onClick={() => setCurrent(idx)}
              >
                {m.type === "video" ? (
                  <video
                    src={getMediaUrl(m.url)}
                    muted
                    preload="metadata"
                    className="thumb__img"
                  />
                ) : (
                  <img
                    src={getMediaUrl(m.url)}
                    alt="thumb"
                    className="thumb__img"
                  />
                )}
                {m.type === "video" && <span className="thumb__play">▶</span>}
              </div>
            ))}
          </div>
          <button
            className="carousel__thumb-btn carousel__thumb-btn--next"
            onClick={next}
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

const AnunciosPage: React.FC = () => {
  const [meuServicoId, setMeuServicoId] = useState<number | null>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "Todos" | "Ativo" | "Pausado" | "Expirado"
  >("Todos");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editing, setEditing] = useState<Anuncio | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await buscarAnuncio();
        if (data.length > 0) setMeuServicoId(data[0].servicoID);
        setAnuncios(
          data.map((item) => ({
            id: String(item.servicoID),
            title: item.nome,
            descricao: item.descricao,
            rawDate: item.dataCriacao,
            preco: item.preco,
            categoria: item.categoria,
            lugarEncontro: item.lugarEncontro,
            createdAt: new Date(item.dataCriacao).toLocaleDateString(),
            status: "Ativo",
            fotos: item.fotos ?? [],
            videos: item.videos ?? [],
          }))
        );
      } catch (err) {
        console.error("Erro ao buscar anúncios:", err);
      }
    })();
  }, []);

  const filtered = anuncios.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Todos" || a.status === filter)
  );

  const handleCreateSuccess = async (item: CriarAnuncioResponse) => {
    try {
      const data = await buscarAnuncio(); // Busca os anúncios atualizados
      const created = data.find((d) => d.servicoID === item.servicoID);
      if (!created) return;

      const novo: Anuncio = {
        id: String(created.servicoID),
        title: created.nome,
        descricao: created.descricao,
        rawDate: created.dataCriacao,
        preco: created.preco,
        categoria: created.categoria,
        lugarEncontro: created.lugarEncontro,
        createdAt: new Date(created.dataCriacao).toLocaleDateString(),
        status: "Ativo",
        fotos: created.fotos ?? [],
        videos: created.videos ?? [],
      };
      setAnuncios((prev) => [novo, ...prev]);
      setIsNewOpen(false);
    } catch (err) {
      console.error("Erro ao buscar anúncio recém-criado:", err);
    }
  };

  const handleEditSuccess = (updated: Anuncio) => {
    setAnuncios((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletarAnuncio(Number(id));
      setAnuncios((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erro ao deletar anúncio:", err);
    }
  };

  const openNewModal = async () => {
    if (meuServicoId === null) {
      const data = await buscarAnuncio();
      if (data.length > 0) setMeuServicoId(data[0].servicoID);
    }
    setIsNewOpen(true);
  };

  return (
    <div className="anuncios-page">
      <header className="anuncios-page__header">
        <h1>Meus Anúncios</h1>
        <button className="btn-new" onClick={openNewModal}>
          <PlusCircle size={20} color="#ffe500" /> Novo Anúncio
        </button>
      </header>
      <div className="anuncios-page__controls">
        <div className="search-wrapper">
          <Search size={16} className="icon-search" />
          <input
            type="text"
            placeholder="Buscar anúncios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="select-wrapper">
          <select
            value={filter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setFilter(e.target.value as any)
            }
          >
            {["Todos", "Ativo", "Pausado", "Expirado"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="icon-arrow" />
        </div>
      </div>
      <div className="anuncios-page__grid">
        {filtered.map((a) => {
          const mediaItems: MediaItem[] = [
            ...a.fotos.map((f) => ({ type: "image" as const, url: f.url })),
            ...a.videos.map((v) => ({ type: "video" as const, url: v.url })),
          ];

          // URL de detalhe via ID
          const detailUrl = `https://www.buzzara.com.br/profile/${a.id}`;

          return (
            <div key={a.id} className="card">
              <div className="card__image">
                <CardCarousel mediaItems={mediaItems} />
                <span className={`badge badge--${a.status.toLowerCase()}`}>
                  {a.status}
                </span>
              </div>
              <div className="card__body">
                <h2 className="card__title">{a.title}</h2>
                <p className="card__date">Criado em {a.createdAt}</p>
                <div className="card__actions">
                  <button title="Editar" onClick={() => setEditing(a)}>
                    <Edit size={16} color="#ffe500" />
                  </button>
                  <button title="Excluir" onClick={() => handleDelete(a.id)}>
                    <Trash2 size={16} color="#e53935" />
                  </button>
                  <a
                    href={detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card__btn-details"
                  >
                    Ver detalhes
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="empty">Nenhum anúncio encontrado.</p>
        )}
      </div>
      <div className="anuncios-page__pagination">
        <button disabled>Anterior</button>
        <span>1 de 1</span>
        <button disabled>Próximo</button>
      </div>
      {isNewOpen && (
        <NewAnuncioModal
          isOpen
          servicoID={meuServicoId ?? 0}
          onClose={() => setIsNewOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
      {editing && (
        <EditAnuncioModal
          isOpen
          anuncio={{
            servicoID: Number(editing.id),
            nome: editing.title,
            descricao: editing.descricao,
            preco: editing.preco,
            categoria: editing.categoria,
            lugarEncontro: editing.lugarEncontro,

            saidas: "",
            idade: 0,
            peso: 0,
            altura: 0,

            servicoPrestado: "",
            servicoEspecial: "",

            localizacao: {
              endereco: "",
              cidade: "",
              estado: "",
              bairro: "",
              latitude: 0,
              longitude: 0,
            },

            disponibilidade: "",
            disponibilidadeDataInicio: "",
            disponibilidadeDataFim: "",
            disponibilidadeHoraInicio: "",
            disponibilidadeHoraFim: "",

            horariosAtendimento: [],

            sobreUsuario: {
              atendimento: [],
              etnia: "",
              relacionamento: "",
              cabelo: "",
              estatura: "",
              corpo: "",
              seios: "",
              pubis: "",
            },

            caches: [
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
              { formaPagamento: "", descricao: "Descrição", valor: 0 },
            ],

            novasFotos: editing.fotos.map((f) => f.url),
            novosVideos: editing.videos.map((v) => v.url),

            dataCriacao: editing.rawDate,

            fotos: [],
            videos: [],
          }}
          onClose={() => setEditing(null)}
          onSuccess={(upd: EditarAnuncioResponse) => {
            const fotosArr = upd.novasFotos ?? [];
            const videosArr = upd.novosVideos ?? [];
            const updated: Anuncio = {
              id: String(upd.servicoID),
              title: upd.nome,
              descricao: upd.descricao,
              rawDate: upd.dataCriacao,
              categoria: upd.categoria,
              lugarEncontro: upd.lugarEncontro,
              preco: upd.preco,
              createdAt: new Date(upd.dataCriacao).toLocaleDateString(),
              status: "Ativo",
              fotos: fotosArr.map((url, idx) => ({ fotoAnuncioID: idx, url })),
              videos: videosArr.map((url, idx) => ({
                videoAnuncioID: idx,
                url,
              })),
            };
            handleEditSuccess(updated);
          }}
        />
      )}
    </div>
  );
};

export default AnunciosPage;
