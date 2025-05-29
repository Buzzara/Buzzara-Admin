import api from "../api";
import {
  UserCreateAnuncioParams,
  UserCreateAnuncioResponse,
} from "../../types/userCreateAnuncio";


function toFormData(data: UserCreateAnuncioParams): FormData {
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


export async function userCreateAnuncio(
  data: UserCreateAnuncioParams
): Promise<UserCreateAnuncioResponse> {
  const formData = toFormData(data);

  const response = await api.post<UserCreateAnuncioResponse>(
    "/anuncios",
    formData,
  );

  return response.data;
}
