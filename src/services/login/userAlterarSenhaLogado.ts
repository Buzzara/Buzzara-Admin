import api from '../api'
import { AlterarSenhaDTO, ApiResponse } from "../../types/userAlterarSenhaLogado";

export async function alterarSenha(data: AlterarSenhaDTO): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>('/auth/alterar-senha', data)
  return response.data
}
