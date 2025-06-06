export interface EnviarFotoAnuncioParams {
  id: number;
  file: File;
}

export interface EnviarFotoAnuncioResponse {
  fotoAnuncioID: number;
  url: string;
  dataUpload: string;
}
