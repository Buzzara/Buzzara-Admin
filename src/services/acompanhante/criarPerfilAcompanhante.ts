import api from "../api";
import type {
  CriarPerfilParams,
  CriarPerfilResponse,
} from "../../types/perfilAcompanhante/useCriarPerfilAcompanhante";

export async function criarPerfilAcompanhante(
  payload: CriarPerfilParams
): Promise<CriarPerfilResponse> {
  const response = await api.post<CriarPerfilResponse>(`/perfis`, payload, {
    withCredentials: true,
  });
  return response.data;
}
