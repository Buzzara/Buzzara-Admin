import api from "../api";

export async function deleteAnuncio(id: number): Promise<void> {
  await api.delete(`/anuncios/${id}`);
}
