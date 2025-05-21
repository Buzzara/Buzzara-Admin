export interface UploadVideoAnuncioFileParams {
  id: number;
  file: File;
}

export interface UploadVideoAnuncioFileResponse {
  videoAnuncioID: number;
  url: string;
  dataUpload: string;
}
