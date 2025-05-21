import api from "../api";
import {
  UploadFotoAnuncioFileParams,
  UploadFotoAnuncioFileResponse,
} from "../../types/userFotoAnuncio";

export async function uploadAnuncioFoto(
  params: UploadFotoAnuncioFileParams
): Promise<UploadFotoAnuncioFileResponse> {
  const formData = new FormData();
  formData.append("File", params.file);

  const response = await api.post<UploadFotoAnuncioFileResponse>(
    `/anuncios/${params.id}/fotos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}
