
import api from "../api";                  
import type { BuscarPerfilAcompanhanteResponse } from "../../types/perfilAcompanhante/useBuscarPerfilAcompanhante";


export async function buscarPerfilAcompanhanteId(id: number): Promise<BuscarPerfilAcompanhanteResponse> {
  const response = await api.get<BuscarPerfilAcompanhanteResponse>(`/perfis/${id}`, {
    withCredentials: true, 
  });

  return response.data;
}
