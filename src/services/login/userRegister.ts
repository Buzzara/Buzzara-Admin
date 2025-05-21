import api from "../api";
import {
  userRegisterParams,
  userRegisterResponse,
} from "../../types/userRegisterTypes";

export async function registrarUsuario(
  data: userRegisterParams
): Promise<userRegisterResponse> {
  const response = await api.post<userRegisterResponse>(
    "/novousuario/register",
    data
  );
  return response.data;
}
