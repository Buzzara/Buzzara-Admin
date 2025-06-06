export interface CriarAnuncioParams {
  nome: string;
  descricao: string;
  preco: number;
  categoria:
    | "Acompanhante"
    | "Mensagens Eróticas"
    | "Vídeo Chamadas"
    | "Sexting";
  lugarEncontro: string;
  disponibilidade: string;
  idade: number;
  peso: number;
  altura: number;
  endereco: string;
  cidade: string;
  estado: string;
  bairro: string;
  latitude: number;
  longitude: number;
  fotos: File[];
  video?: File;
}

export interface Localizacao {
  endereco: string;
  cidade: string;
  estado: string;
  bairro: string;
  latitude: number;
  longitude: number;
}

export interface CriarAnuncioResponse {
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
  localizacao: Localizacao | null;
  fotos: string[];
  videos: string[];
}
