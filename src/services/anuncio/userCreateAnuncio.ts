// src/services/anuncio/userCreateAnuncio.ts
import api from "../api";
import {
  UserCreateAnuncioParams,
  UserCreateAnuncioResponse,
} from "../../types/userCreateAnuncio";

/**
 * Converte um objeto em FormData, tratando arquivos e campos simples.
 */
function toFormData(data: UserCreateAnuncioParams): FormData {
  const form = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;

    // array de fotos (File[])
    if (Array.isArray(value) && value.length && value[0] instanceof File) {
      (value as File[]).forEach((file) => form.append("fotos", file));
      return;
    }

    // vídeo único (File)
    if (value instanceof File) {
      form.append("video", value);
      return;
    }

    // resto de campos (string, number, boolean…)
    form.append(key, String(value));
  });

  return form;
}

/**
 * Cria um novo anúncio enviando multipart/form-data com todos os campos,
 * incluindo fotos e vídeo.
 */
export async function userCreateAnuncio(
  data: UserCreateAnuncioParams
): Promise<UserCreateAnuncioResponse> {
  const formData = toFormData(data);

  const response = await api.post<UserCreateAnuncioResponse>(
    "/anuncios",
    formData,
    {
      // axios detecta FormData e já seta o Content-Type correto
    }
  );

  return response.data;
}
