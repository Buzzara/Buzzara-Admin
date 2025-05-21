// src/services/profile/usuario/userUploadFotosPerfil.ts
import api from '../../api'       // <–– seu axios instance com baseURL
export interface PhotoUploadPayload {
  profilePhoto?: File
  coverPhoto?: File
}

export interface PhotoUploadResponse {
  fotoPerfilUrl: string
  fotoCapaUrl: string
}

export async function uploadUserPhotos(
  userId: number,
  payload: PhotoUploadPayload
): Promise<PhotoUploadResponse> {
  console.log('[userUploadFotosPerfil] upload para user:', userId)
  const formData = new FormData()
  formData.append('idUsuario', String(userId))
  if (payload.profilePhoto) formData.append('FotoPerfil', payload.profilePhoto)
  if (payload.coverPhoto)   formData.append('FotoCapa', payload.coverPhoto)

  // usa `api` (com baseURL setada) — não axios.post() direto
  const { data } = await api.post<PhotoUploadResponse>(
    '/usuarios/upload-fotos',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  )
  console.log('[userUploadFotosPerfil] recebeu:', data)
  return data
}
