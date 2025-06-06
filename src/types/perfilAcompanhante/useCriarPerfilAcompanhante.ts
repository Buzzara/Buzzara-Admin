
export interface CriarPerfilParams {
  perfilAcompanhanteID: number; 
  usuarioID: number;
  descricao: string;
  localizacao: string;
  tarifa: number;
  telefone: string;
  estaOnline: boolean;
  ultimoAcesso: string;
  ultimoIP: string;
}


export interface CriarPerfilResponse {
  message: string;
  perfilId: number;
}
