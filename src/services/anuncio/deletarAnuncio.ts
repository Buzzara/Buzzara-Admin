import api from "../api";

export async function deletarAnuncio(id: number): Promise<void> {
  await api.delete(`/anuncios/${id}`);
}
