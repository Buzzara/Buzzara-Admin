import api from "../../api";
import { AtualizarPerfilAcompanhanteDto } from "../../../types/perfilAcompanhante/useAtualizarInformacaoPerfilAcompanhante";

export const atualizarPerfilAcompanhante = async (
  id: number,
  payload: AtualizarPerfilAcompanhanteDto
) => {
  return await api.put(`/perfis/${id}`, payload, { withCredentials: true });
};
