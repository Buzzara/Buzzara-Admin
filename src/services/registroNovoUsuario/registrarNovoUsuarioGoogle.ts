import api from "../api";
import {
  RegistrarNovoUsuarioGooogleParams,
  RegistrarNovoUsuarioGoogleResponse,
} from "../../types/RegistroNovoUsuario/useRegistrarNovoUsuarioGoogle";

export async function registrarNovoUsuarioGoogle(
  data: RegistrarNovoUsuarioGooogleParams
): Promise<RegistrarNovoUsuarioGoogleResponse> {
  const response = await api.post<RegistrarNovoUsuarioGoogleResponse>(
    "/usuarios/register-google",
    data
  );
  return response.data;
}
