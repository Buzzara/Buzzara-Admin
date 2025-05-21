
export interface PhotoUploadPayload {
  profilePhoto?: File;
  coverPhoto?: File;
}

export interface PhotoUploadResponse {
  userId: number;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
}
