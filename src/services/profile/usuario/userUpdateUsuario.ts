import api from "../../api";
import { UserProfile } from "../../../types/userProfile";

export const updateUsuario = async (usuarioID: number, usuarioAtualizado: Partial<UserProfile>) => {
  return await api.put(`/usuarios/${usuarioID}`, { usuarioAtualizado }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
