// src/types/useAtualizarPerfilAcompanhante.ts

export interface AtualizarPerfilAcompanhanteDto {
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
