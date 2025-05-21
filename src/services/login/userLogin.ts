import api from "../api";
import { UserLoginParams, UserLoginResponse } from "../../types/userLoginTypes";

export async function userLogin(data: UserLoginParams): Promise<UserLoginResponse> {
  const response = await api.post<UserLoginResponse>("/auth/login", data);
  return response.data;
}
