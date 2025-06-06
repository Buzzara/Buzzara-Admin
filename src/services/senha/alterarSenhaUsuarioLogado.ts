import api from '../api'
import { AlterarSenhaDTO, ApiResponse } from "../../types/senha/userAlterarSenhaLogado";

export async function alterarSenhaUsuarioLogado(data: AlterarSenhaDTO): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>('/auth/alterar-senha', data)
  return response.data
}
