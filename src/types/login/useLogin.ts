export interface LoginParams {
    email: string
    password: string
  }
  
  export interface LoginResponse {
    accessToken: string
    refreshToken: string
    userData: {
      id: number
      nome: string
      email: string
      ativo: boolean
      role: string
      abilityRules: {
        action: string
        subject: string
      }[]
    }
  }
  