import api from "../api";
export interface PhotoUploadPayload {
  profilePhoto?: File;
  coverPhoto?: File;
}

export interface PhotoUploadResponse {
  fotoPerfilUrl: string;
  fotoCapaUrl: string;
}

export async function atualizarFotoDePerfil(
  userId: number,
  payload: PhotoUploadPayload
): Promise<PhotoUploadResponse> {
  console.log("[userUploadFotosPerfil] upload para user:", userId);
  const formData = new FormData();
  formData.append("idUsuario", String(userId));
  if (payload.profilePhoto) formData.append("FotoPerfil", payload.profilePhoto);
  if (payload.coverPhoto) formData.append("FotoCapa", payload.coverPhoto);

  const { data } = await api.post<PhotoUploadResponse>(
    "/usuarios/upload-fotos",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  console.log("[userUploadFotosPerfil] recebeu:", data);
  return data;
}
