export interface EnviarVideoAnuncioParams {
  id: number;
  file: File;
}

export interface EnviarVideoAnuncioResponse {
  videoAnuncioID: number;
  url: string;
  dataUpload: string;
}
