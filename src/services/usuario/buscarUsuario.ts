
import api from '../api'
import type { UserProfile } from '../../types/usuario/userProfile'

export async function buscarUsuario(): Promise<UserProfile> {
  console.log('[userGetUsuario] GET /usuarios/me')
  const { data } = await api.get<UserProfile>('/usuarios/me')
  console.log('[userGetUsuario] recebeu /me:', data)
  return data
}
