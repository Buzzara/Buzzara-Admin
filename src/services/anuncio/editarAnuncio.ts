import api from "../api";
import type {
  EditarAnuncioParams,
  EditarAnuncioResponse,
} from "../../types/anuncio/useEditarAnuncio";

export async function editarAnuncio(
  servicoId: number,
  params: EditarAnuncioParams
): Promise<EditarAnuncioResponse> {
  const form = new FormData();
  form.append("nome", params.nome);
  form.append("descricao", params.descricao);
  form.append("preco", params.preco.toString());
  form.append("categoria", params.categoria);
  form.append("lugarEncontro", params.lugarEncontro);
  form.append("disponibilidade", params.disponibilidade);

  if (params.novasFotos && params.novasFotos.length > 0) {
    params.novasFotos.forEach((file) => form.append("NovasFotos", file));
  }

  if (params.novoVideo) {
    form.append("NovoVideo", params.novoVideo);
  }

  const response = await api.put<EditarAnuncioResponse>(
    `/anuncios/${servicoId}`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}
