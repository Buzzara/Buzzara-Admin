import api from "../api";
import {
  RegistrarNovoUsuarioParams,
  RegistrarNovoUsuarioResponse,
} from "../../types/RegistroNovoUsuario/useRegistrarNovoUsuario";

export async function registrarNovoUsuario(
  data: RegistrarNovoUsuarioParams
): Promise<RegistrarNovoUsuarioResponse> {
  const response = await api.post<RegistrarNovoUsuarioResponse>(
    "/novousuario/register",
    data
  );
  return response.data;
}
