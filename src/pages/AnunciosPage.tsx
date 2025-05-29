// src/pages/AnunciosPage.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { Edit, Trash2, PlusCircle, Search, ChevronDown } from "lucide-react";

import NewAnuncioModal from "../components/Anuncio/AnuncioModal";
import EditAnuncioModal from "../components/EditAnuncioModal/EditAnuncioModal";

import { userGetAnuncios } from "../services/anuncio/userBuscaAnuncio";
import { deleteAnuncio } from "../services/anuncio/deleteAnuncio";

import type { AnuncioResponse, FotoAnuncioDTO, VideoAnuncioDTO } from "../types/userAnuncio";
import type { AnuncioEditResponse } from "../types/useEditarAnuncio";

import "../styles/anunciosPage.scss";

interface Anuncio {
  id: string;
  title: string;
  imageUrl: string;
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

const FILTER_OPTIONS = ["Todos", "Ativo", "Pausado", "Expirado"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

const AnunciosPage: React.FC = () => {
  const [meuServicoId, setMeuServicoId] = useState<number | null>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("Todos");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editing, setEditing] = useState<Anuncio | null>(null);

  // carrega anúncios
  useEffect(() => {
    (async () => {
      try {
        const data = await userGetAnuncios();
        if (data.length > 0) {
          setMeuServicoId(data[0].servicoID);
        }

        const list: Anuncio[] = data.map(item => {
          const fotosDTO: FotoAnuncioDTO[] = item.fotos ?? [];
          const videosDTO: VideoAnuncioDTO[] = item.videos ?? [];

          return {
            id: String(item.servicoID),
            title: item.nome,
            descricao: item.descricao,
            rawDate: item.dataCriacao,
            preco: item.preco,
            categoria: item.categoria,
            lugarEncontro: item.lugarEncontro,
            imageUrl: fotosDTO[0]?.url ?? "",
            status: "Ativo",
            createdAt: new Date(item.dataCriacao).toLocaleDateString(),
            fotos: fotosDTO.map(f => ({ fotoAnuncioID: f.fotoAnuncioID, url: f.url })),
            videos: videosDTO.map(v => ({ videoAnuncioID: v.videoAnuncioID, url: v.url })),
          };
        });

        setAnuncios(list);
      } catch (err) {
        console.error("Erro ao buscar anúncios:", err);
      }
    })();
  }, []);

  const filtered = anuncios.filter(
    a =>
      a.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Todos" || a.status === filter)
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilter(e.target.value as FilterOption);

  // ao criar novo anúncio
  function handleCreateSuccess(item: AnuncioResponse) {
    const fotosDTO: FotoAnuncioDTO[] = item.fotos ?? [];
    const videosDTO: VideoAnuncioDTO[] = item.videos ?? [];

    const novo: Anuncio = {
      id: String(item.servicoID),
      title: item.nome,
      descricao: item.descricao,
      rawDate: item.dataCriacao,
      preco: item.preco,
      categoria: item.categoria,
      lugarEncontro: item.lugarEncontro,
      imageUrl: fotosDTO[0]?.url ?? "",
      status: "Ativo",
      createdAt: new Date(item.dataCriacao).toLocaleDateString(),
      fotos: fotosDTO.map(f => ({ fotoAnuncioID: f.fotoAnuncioID, url: f.url })),
      videos: videosDTO.map(v => ({ videoAnuncioID: v.videoAnuncioID, url: v.url })),
    };
    setAnuncios(prev => [novo, ...prev]);
    setIsNewOpen(false);
  }

  // ao editar anúncio
  function handleEditSuccess(updated: Anuncio) {
    setAnuncios(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    setEditing(null);
  }

  // excluir anúncio
  async function handleDelete(id: string) {
    try {
      await deleteAnuncio(Number(id));
      setAnuncios(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Erro ao deletar anúncio:", err);
    }
  }

  return (
    <div className="anuncios-page">
      <header className="anuncios-page__header">
        <h1>Meus Anúncios</h1>
        <button className="btn-new" onClick={() => setIsNewOpen(true)}>
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
            onChange={handleSearchChange}
          />
        </div>
        <div className="select-wrapper">
          <select value={filter} onChange={handleFilterChange}>
            {FILTER_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="icon-arrow" />
        </div>
      </div>

      <div className="anuncios-page__grid">
        {filtered.map(a => {
          const hasVideo = a.videos.length > 0;
          const mediaUrl = hasVideo ? a.videos[0].url : a.imageUrl;
          return (
            <div key={a.id} className="card">
              <div className="card__image">
                {hasVideo ? (
                  <video
                    controls
                    src={getMediaUrl(mediaUrl)}
                    poster={getMediaUrl(a.imageUrl)}
                    className="card__img"
                  />
                ) : (
                  <img
                    src={getMediaUrl(mediaUrl)}
                    alt={a.title}
                    className="card__img"
                  />
                )}
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
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="empty">Nenhum anúncio encontrado.</p>}
      </div>

      {/* Paginação stub */}
      <div className="anuncios-page__pagination">
        <button disabled>Anterior</button>
        <span>1 de 1</span>
        <button disabled>Próximo</button>
      </div>

      {/* Novo anúncio */}
      {isNewOpen && meuServicoId !== null && (
        <NewAnuncioModal
          isOpen
          servicoID={meuServicoId}
          onClose={() => setIsNewOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Editar anúncio */}
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
            disponibilidadeDataInicio: "",
            disponibilidadeDataFim: "",
            disponibilidadeHoraInicio: "",
            disponibilidadeHoraFim: "",
            disponibilidade: "",
            // camelCase conforme interface
            novasFotos: editing.fotos.map(f => f.url),
            novosVideos: editing.videos.map(v => v.url),
            dataCriacao: editing.rawDate,
          }}
          onClose={() => setEditing(null)}
          onSuccess={(upd: AnuncioEditResponse) => {
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
              imageUrl: fotosArr[0] ?? "",
              status: "Ativo",
              createdAt: new Date(upd.dataCriacao).toLocaleDateString(),
              fotos: fotosArr.map((url, idx) => ({ fotoAnuncioID: idx, url })),
              videos: videosArr.map((url, idx) => ({ videoAnuncioID: idx, url })),
            };
            handleEditSuccess(updated);
          }}
        />
      )}
    </div>
  );
};

export default AnunciosPage;
