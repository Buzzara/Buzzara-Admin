import api from "../api";
import {
  UploadVideoAnuncioFileParams,
  UploadVideoAnuncioFileResponse,
} from "../../types/userVideoAnuncio";

export async function uploadAnuncioVideo(
  params: UploadVideoAnuncioFileParams
): Promise<UploadVideoAnuncioFileResponse> {
  const formData = new FormData();
  formData.append("File", params.file);

  const response = await api.post<UploadVideoAnuncioFileResponse>(
    `/anuncios/${params.id}/videos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
