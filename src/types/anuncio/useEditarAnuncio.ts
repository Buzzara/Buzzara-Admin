
export interface FotoAnuncioDTO {
  fotoAnuncioID: number;
  url: string;
  dataUpload: string; 
}

export interface VideoAnuncioDTO {
  videoAnuncioID: number;
  url: string;
  dataUpload: string; 
}

export interface LocalizacaoDTO {
  endereco: string;
  cidade: string;
  estado: string;
  bairro: string;
  latitude: number;
  longitude: number;
}

export interface EditarAnuncioParams {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  lugarEncontro: string;
  disponibilidade: string;
  novasFotos?: File[];
  novoVideo?: File;
}

export interface EditarAnuncioResponse {
  servicoID: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  lugarEncontro: string;
  disponibilidade: string;
  disponibilidadeDataInicio: string;
  disponibilidadeDataFim: string;
  disponibilidadeHoraInicio: string;
  disponibilidadeHoraFim: string;
  novasFotos?: string[];
  novosVideos?: string[];
  dataCriacao: string; 
}
