
export interface LocalidadeProximaParams {
  latitude: number;
  longitude: number;
}

/** cada item do resultado */
export interface LocalidadeProximaResponse {
  nome: string;
  cidade: string;
  estado: string;
  distanciaKm: number;
}

/** um array de itens */
export type LocalidadesProximasResponse = LocalidadeProximaResponse[];
