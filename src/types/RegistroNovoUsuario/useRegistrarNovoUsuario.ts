export interface RegistrarNovoUsuarioParams {
  nomeCompleto: string;
  telefone: string;
  email: string;
  cpf: string;
  genero: string;
  senha: string;
  confirmaSenha: string;
  isValid?: boolean;
  dataNascimento: string;
}

export interface RegistrarNovoUsuarioResponse {
  message: string;
}
