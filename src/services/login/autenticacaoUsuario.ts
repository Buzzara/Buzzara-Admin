import api from "../api";
import { AutenticacaoUsuarioResponse } from "../../types/login/useAutenticacaoUsuario";

export async function autenticacaoUsuario(): Promise<AutenticacaoUsuarioResponse> {
  const response = await api.get<AutenticacaoUsuarioResponse>("/auth/me");
  console.log("[authUser.ts] /auth/me response.data:", response.data);
  return response.data;
}
