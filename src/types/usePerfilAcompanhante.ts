
export interface PerfilAcompanhanteResponse {
  usuarioID: number;
  perfilAcompanhanteID: number;
  nome: string;
  email: string;
  telefone: string;
  genero: string;
  dataNascimento: string;    // formato ISO: "2025-04-28T17:37:09.02"
  fotoPerfilUrl: string;     // ex: "/uploads/usuarios/2/perfil_ee70...jpg"
  fotoCapaUrl: string;       // ex: "/uploads/usuarios/2/capa_f005...jpg"
  descricao: string;
  localizacao: string;
  tarifa: number;
  estaOnline: boolean;
  ultimoAcesso: string;      // formato ISO: "2025-06-02T21:21:10.8884167"
  ultimoIP: string;
}
