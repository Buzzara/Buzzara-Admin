// src/types/anuncio.ts

/**
 * Payload para criar um anúncio.
 * Note que para envio de arquivos você vai montar um FormData
 * em vez de enviar JSON puro.
 */
export interface AnuncioCreateParams {
  servicoID: number;
  nome: string;
  descricao: string;
  preco: number;
  dataCriacao: string; // ISO string, ex: "2025-04-28T20:02:38.9125217Z"
  fotos?: File[]; // array de imagens
  video?: File; // vídeo único
}

/**
 * Tipo da resposta do endpoint POST /anuncios.
 * Ajuste os campos exatamente como sua API retorna.
 */
export interface AnuncioResponse {
  id: number;
  servicoID: number;
  nome: string;
  descricao: string;
  categoria: string;
  lugarEncontro: string;
  preco: number;
  fotos: string[]; // URLs das imagens
  video: string; // URL do vídeo
  dataCriacao: string; // ISO string
}
