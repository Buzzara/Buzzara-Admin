import api from "../api";
import {
  EnviarVideoAnuncioParams,
  EnviarVideoAnuncioResponse,
} from "../../types/anuncio/useEnviarVideoAnuncio";

export async function enviarVideoAnuncio(
  params: EnviarVideoAnuncioParams
): Promise<EnviarVideoAnuncioResponse> {
  const formData = new FormData();
  formData.append("File", params.file);

  const response = await api.post<EnviarVideoAnuncioResponse>(
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
