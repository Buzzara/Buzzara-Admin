export interface AlterarSenhaDTO {
    senhaAtual: string;
    novaSenha: string;
    confirmarNovaSenha: string;
  }
  

  export interface ApiResponse {
    message?: string;
    errors?: string[]; 
  }