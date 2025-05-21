import api from "../api";
import {
  userRegisterGooogleParams,
  userRegisterGoogleResponse,
} from "../../types/userRegisterGoogleTypes";

export async function registrarUsuario(
  data: userRegisterGooogleParams
): Promise<userRegisterGoogleResponse> {
  const response = await api.post<userRegisterGoogleResponse>(
    "/usuarios/register-google",
    data
  );
  return response.data;
}
