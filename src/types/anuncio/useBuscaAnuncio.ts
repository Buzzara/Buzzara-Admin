export interface userBuscaAnuncioResponse {
  servicoID: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  lugarEncontro: string;
  disponibilidade?: string | null;
  idade?: number | null;
  peso?: number | null;
  altura?: number | null;
  saidas?: string;
  servicoPrestado?: string;
  servicoEspecial?: string;
  fotos: {
    fotoAnuncioID: number;
    url: string;
    dataUpload: string;
  }[];
  videos: {
    videoAnuncioID: number;
    url: string;
    dataUpload: string;
  }[];
}
