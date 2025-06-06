import { Estado } from "../../types/localizacao/useEstado";

export async function buscarEstadosIBGE(): Promise<Estado[]> {
  const url = import.meta.env.VITE_API_IBGE_ESTADOS!;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Erro ao buscar estados IBGE");
  }
  const data: Estado[] = await res.json();
  return data;
}

export async function buscarCidadesPorEstado(uf: string): Promise<string[]> {
  const res = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  );
  if (!res.ok) {
    throw new Error("Erro ao buscar cidades IBGE");
  }
  const data = await res.json();
  const nomes: string[] = data.map((obj: any) => obj.nome);
  return nomes;
}
