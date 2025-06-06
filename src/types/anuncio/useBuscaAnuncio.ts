export interface userBuscaAnuncioResponse {
  servicoID: number;
  nome: string;
  descricao: string;
  preco: number;
  dataCriacao: string;
  categoria: string;
  lugarEncontro: string;
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
