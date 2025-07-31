export interface EditarAnuncioParams {
  nome?: string;
  descricao: string;
  saidas: string;
  lugarEncontro: string[]; // Vai ser convertido para string com join(", ")
  servicoPrestado: string;
  servicoEspecial: string;
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

  fotos: File[];           // arquivos enviados
  video?: File;            // vídeo opcional

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

  /** CAMPO OBRIGATÓRIO */
  mesmoHorarioTodosOsDias: boolean;

  /** SE mesmoHorarioTodosOsDias === true, este campo será usado */
  horarioUnico?: {
    diaSemana: string;         // ex: "Segunda"
    atende: boolean;
    horarioInicio: string;
    horarioFim: string;
    vinteQuatroHoras: boolean;
  };

  /** SE mesmoHorarioTodosOsDias === false, este campo será usado */
  horariosIndividuais?: Array<{
    diaSemana: string;         // ex: "Segunda"
    atende: boolean;
    horarioInicio: string | null;
    horarioFim: string | null;
    vinteQuatroHoras: boolean;
  }>;
}


export interface EditarAnuncioResponse {
  servicoID: number;
  nome: string;
  descricao: string;
  saidas: string;
  lugarEncontro: string;
  servicoPrestado?: string;
  servicoEspecial?: string;
  disponibilidade: string;
  idade: number;
  peso: number;
  altura: number;
  preco: number;
  categoria: string;
  dataCriacao: string;

  disponibilidadeDataInicio: string;
  disponibilidadeDataFim: string;
  disponibilidadeHoraInicio: string;
  disponibilidadeHoraFim: string;

  novasFotos?: string[];
  novosVideos?: string[];

  localizacao: {
    endereco: string;
    cidade: string;
    estado: string;
    bairro: string;
    latitude: number | null;
    longitude: number | null;
  } | null;

  fotos: Array<{
    fotoAnuncioID: number;
    url: string;
    dataUpload: string;
  }>;

  videos: Array<{
    videoAnuncioID: number;
    url: string;
  }>;

  sobreUsuario: {
    atendimento: string[];
    etnia: string;
    relacionamento: string;
    cabelo: string;
    estatura: string;
    corpo: string;
    seios: string;
    pubis: string;
  } | null;

  caches: Array<{
    formaPagamento: string;
    descricao: string;
    valor: number;
  }> | null;

  horariosAtendimento: Array<{
    diaSemana: string;
    atende: boolean;
    horarioInicio: string | null;
    horarioFim: string | null;
    vinteQuatroHoras: boolean;
  }>;
}
