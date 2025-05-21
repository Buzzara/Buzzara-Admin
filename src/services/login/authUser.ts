import api from "../api";
import { AuthUserResponse } from "../../types/authUser";

export async function authUser(): Promise<AuthUserResponse> {
  const response = await api.get<AuthUserResponse>("/auth/me");
  console.log("[authUser.ts] /auth/me response.data:", response.data);
  return response.data;
}

