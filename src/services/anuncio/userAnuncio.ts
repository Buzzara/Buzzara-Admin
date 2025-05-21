// src/services/userAnunciosService.ts

import api from "../api";
import {
    AnuncioCreateParams,
    AnuncioResponse,
} from "../../types/userAnuncio";

export async function userCreateAnuncio(
  params: AnuncioCreateParams
): Promise<AnuncioResponse> {
  const form = new FormData();
  form.append("servicoID", String(params.servicoID));
  form.append("nome", params.nome);
  form.append("descricao", params.descricao);
  form.append("preco", String(params.preco));
  form.append("dataCriacao", params.dataCriacao);

  params.fotos?.forEach((file, idx) =>
    form.append(`fotos[${idx}]`, file)
  );
  if (params.video) {
    form.append("video", params.video);
  }

  const { data } = await api.post<AnuncioResponse>(
    "/anuncios",
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}
