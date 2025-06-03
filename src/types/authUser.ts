export interface AuthUserResponse {
    accessToken: string
    refreshToken: string
    userData: {
      id: number
      nome: string
      email: string
      role: string
      ativo: boolean
      abilityRules: {
        action: string
        subject: string
      }[]
    }
  }
  