export interface CriarAnuncioParams {
  id?: number;
  nome: string;
  descricao: string;
  saidas: string;
  lugarEncontro: string[];       // agora array
  servicoPrestado: string;
  servicoEspecial: string;
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
  sobreUsuario: {
    atendimento: string[];
    etnia: string;
    relacionamento: string;
    cabelo: string;
    estatura: string;
    corpo: string;
    seios: string;
    pubis: string;
  };
  caches: Array<{
    formaPagamento: string;
    descricao: string;
    valor: number;
  }>;
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
  saidas: string;
  categoria: string[];           // agora array
  lugarEncontro: string[];       // agora array
  servicoPrestado: string;
  servicoEspecial: string;
  disponibilidade: string;
  idade: number;
  peso: number;
  altura: number;
  dataCriacao: string;
  localizacao: Localizacao | null;
  fotos: string[];
  videos: string[];
  sobreUsuario: {
    atendimento: string[];
    etnia: string;
    relacionamento: string;
    cabelo: string;
    estatura: string;
    corpo: string;
    seios: string;
    pubis: string;
  };
  caches: Array<{
    formaPagamento: string;
    descricao: string;
    valor: number;
  }>;
}
