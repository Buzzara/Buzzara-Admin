
export interface UserCreateAnuncioParams {
  nome: string;
  descricao: string;
  preco: number;
  categoria: "Acompanhante" | "Mensagens Eróticas" | "Vídeo Chamadas" | "Sexting";
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
  fotos: File[];     // array de arquivos de imagem
  video?: File;      // opcional, um único arquivo de vídeo
}

/** Estrutura de localização, presente no response */
export interface Localizacao {
  endereco: string;
  cidade: string;
  estado: string;
  bairro: string;
  latitude: number;
  longitude: number;
}

/** Resposta retornada pelo backend ao criar o anúncio */
export interface UserCreateAnuncioResponse {
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
  dataCriacao: string;           // ISO string
  localizacao: Localizacao | null;
  fotos: string[];               // URLs ou identificadores de imagem
  videos: string[];              // URLs ou identificadores de vídeo
}
