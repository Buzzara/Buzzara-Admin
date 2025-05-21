export interface userRegisterParams {
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

export interface userRegisterResponse {
  message: string;
}
