// src/types/useEditarAnuncio.ts

// Tipagem dos arquivos de mídia e localização
export interface FotoAnuncioDTO {
  fotoAnuncioID: number;
  url: string;
  dataUpload: string; // ISO datetime
}

export interface VideoAnuncioDTO {
  videoAnuncioID: number;
  url: string;
  dataUpload: string; // ISO datetime
}

export interface LocalizacaoDTO {
  endereco: string;
  cidade: string;
  estado: string;
  bairro: string;
  latitude: number;
  longitude: number;
}

// === Payload que você envia no PUT /anuncios/{servicoId}
export interface AnuncioEditParams {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  lugarEncontro: string;
  disponibilidade: string;
  // se vierem novas fotos, substituem TODAS as antigas
  novasFotos?: File[];
  // se vier um vídeo, substitui o antigo
  novoVideo?: File;
}

// === Response do back-end após o update
export interface AnuncioEditResponse {
  servicoID: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  lugarEncontro: string;
  
  // dados de disponibilidade detalhada para pré-preencher o modal
  disponibilidade: string;
  disponibilidadeDataInicio: string;
  disponibilidadeDataFim: string;
  disponibilidadeHoraInicio: string;
  disponibilidadeHoraFim: string;

  // URLs das novas mídias retornadas após o update
  novasFotos?: string[];
  novosVideos?: string[];

  dataCriacao: string; // ISO datetime
}
