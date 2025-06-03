
export interface CreatePerfilRequest {
  perfilAcompanhanteID: number; // normalmente 0 para “novo” (será gerado no servidor)
  usuarioID: number;
  descricao: string;
  localizacao: string;
  tarifa: number;
  telefone: string;
  estaOnline: boolean;
  ultimoAcesso: string; // ISO string, ex: "2025-06-02T21:33:50.727Z"
  ultimoIP: string;
}


export interface CreatePerfilResponse {
  message: string;
  perfilId: number;
}
