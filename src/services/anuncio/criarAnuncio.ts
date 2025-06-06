import api from "../api";
import {
  CriarAnuncioParams,
  CriarAnuncioResponse,
} from "../../types/anuncio/useCriarAnuncio";

function toFormData(data: CriarAnuncioParams): FormData {
  const form = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;

    if (Array.isArray(value) && value.length && value[0] instanceof File) {
      (value as File[]).forEach((file) => form.append("fotos", file));
      return;
    }

    if (value instanceof File) {
      form.append("video", value);
      return;
    }

    form.append(key, String(value));
  });

  return form;
}

export async function criarAnuncio(
  data: CriarAnuncioParams
): Promise<CriarAnuncioResponse> {
  const formData = toFormData(data);

  const response = await api.post<CriarAnuncioResponse>("/anuncios", formData);

  return response.data;
}
