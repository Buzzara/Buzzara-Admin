import type { FotoAnuncioDTO, VideoAnuncioDTO } from "../../types/anuncio/useEditarAnuncio";

export interface AnuncioCreateParams {
  servicoID: number;
  nome: string;
  descricao: string;
  preco: number;
  dataCriacao: string; 
  fotos?: File[]; 
  video?: File; 
}


export interface AnuncioResponse {
  id: number;
  servicoID: number;
  nome: string;
  descricao: string;
  categoria: string;
  lugarEncontro: string;
  preco: number;
  fotos?: FotoAnuncioDTO[];
  videos?: VideoAnuncioDTO[];
  dataCriacao: string; 
}