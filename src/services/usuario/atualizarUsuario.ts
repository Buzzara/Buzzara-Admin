import api from "../api";
import { UserProfile } from "../../types/usuario/userProfile";

export const atualizarUsuario = async (usuarioID: number, usuarioAtualizado: Partial<UserProfile>) => {
  return await api.put(`/usuarios/${usuarioID}`, { usuarioAtualizado }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
