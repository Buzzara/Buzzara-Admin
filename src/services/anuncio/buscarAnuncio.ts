import api from "../api";
import { userBuscaAnuncioResponse } from "../../types/anuncio/useBuscaAnuncio";

export async function buscarAnuncio(): Promise<userBuscaAnuncioResponse[]> {
  const { data } = await api.get<userBuscaAnuncioResponse[]>("/anuncios");
  return data;
}
