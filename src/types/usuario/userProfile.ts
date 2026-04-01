export interface UserProfile {
  usuarioID: number
  nome: string
  email: string
  telefone: string
  genero?: string | null
  localizacao?: string | null
  descricao?: string | null
  dataNascimento?: string | null
  ativo: boolean
  perfilAcompanhanteID?: number | null;
  role: string
  fotoPerfilUrl: string | null
  fotoCapaUrl: string | null
}
