export interface UserLoginParams {
    email: string
    password: string
  }
  
  export interface UserLoginResponse {
    accessToken: string
    refreshToken: string
    userData: {
      id: number
      nome: string
      email: string
      role: string
      abilityRules: {
        action: string
        subject: string
      }[]
    }
  }
  