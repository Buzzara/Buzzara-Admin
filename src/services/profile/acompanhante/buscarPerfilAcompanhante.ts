
import api from "../../api";                  
import type { PerfilAcompanhanteResponse } from "../../../types/usePerfilAcompanhante";


export async function getPerfilById(id: number): Promise<PerfilAcompanhanteResponse> {
  const response = await api.get<PerfilAcompanhanteResponse>(`/perfis/${id}`, {
    withCredentials: true, 
  });

  return response.data;
}
