import api from "../../api";
import type { CreatePerfilRequest, CreatePerfilResponse } from "../../../types/useCriarPerfilAcompanhante";


export async function createPerfil(
  payload: CreatePerfilRequest
): Promise<CreatePerfilResponse> {

  const response = await api.post<CreatePerfilResponse>(
    "/perfis",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
  return response.data;
}
