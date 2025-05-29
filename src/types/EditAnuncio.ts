// src/types/EditAnuncio.ts
export interface MediaFile {
  fotoAnuncioID?: number;
  videoAnuncioID?: number;
  url: string;
  dataUpload: string;
}

export interface EditAnuncioPayload {
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
  dataCriacao: string;
  localizacao: null;
  fotos: MediaFile[];
  videos: MediaFile[];
}
