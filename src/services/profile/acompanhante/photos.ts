import { PhotoUploadPayload, PhotoUploadResponse } from '../../../types/userUploadFotosPerfil';

export async function uploadUserPhotos(
  userId: number,
  payload: PhotoUploadPayload
): Promise<PhotoUploadResponse> {
  const formData = new FormData();
  if (payload.profilePhoto) {
    formData.append('ProfilePhoto', payload.profilePhoto);
  }
  if (payload.coverPhoto) {
    formData.append('CoverPhoto', payload.coverPhoto);
  }

  const res = await fetch(`/api/users/${userId}/photos`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} – ${text}`);
  }

  const data = (await res.json()) as PhotoUploadResponse;
  return data;
}
