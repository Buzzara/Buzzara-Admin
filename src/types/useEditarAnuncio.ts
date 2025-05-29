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
  disponibilidade: string;
  idade: number;
  peso: number;
  altura: number;
  dataCriacao: string;           // ISO datetime
  localizacao: LocalizacaoDTO | null;
  fotos: FotoAnuncioDTO[];
  videos: VideoAnuncioDTO[];
}


export interface DisponibilidadeDetalhada {
  disponibilidadeDataInicio?: string;
  disponibilidadeDataFim?: string;
  disponibilidadeHoraInicio?: string;
  disponibilidadeHoraFim?: string;
}