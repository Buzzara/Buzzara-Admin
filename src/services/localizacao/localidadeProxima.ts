
import api from "../api";
import {
  LocalidadeProximaParams,
  LocalidadesProximasResponse,
} from "../../types/localizacao/useLocalidadeProxima";

export async function getLocalidadesProximas(
  params: LocalidadeProximaParams
): Promise<LocalidadesProximasResponse> {
  const { latitude, longitude } = params;
  const response = await api.get<LocalidadesProximasResponse>(
    "/localidades/localidades-proximas",
    { params: { latitude, longitude } }
  );
  return response.data;
}
