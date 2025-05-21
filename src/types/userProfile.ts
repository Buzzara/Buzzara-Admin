export interface UserProfile {
  usuarioID: number
  nome: string
  email: string
  senhaHash: string
  dataCadastro: string          
  refreshToken: string | null
  refreshTokenExpiration: string | null
  isValid: boolean
  telefone: string
  cpf: string
  genero: string
  validationToken: string
  dataNascimento: string         
  validationTokenExpiration: string
  ativo: boolean
  role: string
  fotoPerfilUrl: string | null
  fotoCapaUrl: string | null
  perfisAcompanhantes: []    
  agendamentos: []            
}
