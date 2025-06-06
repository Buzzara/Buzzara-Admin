import api from "../api";
import { LoginParams, LoginResponse } from "../../types/login/useLogin";

export async function usuariologin(data: LoginParams): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}
