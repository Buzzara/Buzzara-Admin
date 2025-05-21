import api from "../api";
import { userGetAnuncioResponse } from "../../types/userBuscaAnuncio";

export async function userGetAnuncios(): Promise<userGetAnuncioResponse[]> {
  const { data } = await api.get<userGetAnuncioResponse[]>("/anuncios");
  return data;
}
