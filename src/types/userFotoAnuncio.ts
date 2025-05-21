export interface UploadFotoAnuncioFileParams {
    id: number
    file: File
  }
  
  export interface UploadFotoAnuncioFileResponse {
    fotoAnuncioID: number     
    url: string               
    dataUpload: string        
  }
  
