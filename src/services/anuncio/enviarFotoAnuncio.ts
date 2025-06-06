import api from "../api";
import {
  EnviarFotoAnuncioParams,
  EnviarFotoAnuncioResponse,
} from "../../types/anuncio/useEnviarFotoAnuncio";

export async function enviarFotoAnuncio(
  params: EnviarFotoAnuncioParams
): Promise<EnviarFotoAnuncioResponse> {
  const formData = new FormData();
  formData.append("File", params.file);

  const response = await api.post<EnviarFotoAnuncioResponse>(
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
