import React, { useRef, ChangeEvent } from "react";
import { Pencil, Save } from "lucide-react";
import "./ProfileCard.scss";
import defaultAvatar from "../../assets/image/user.png";
import defaultCoverImage from "../../assets/image/wallpaper.jpg";

export interface ProfileCardProps {
  name: string;
  role: string;
  avatarUrl?: string;
  coverUrl?: string;

  // upload callbacks
  onProfileSelect: (file: File) => void;
  onCoverSelect: (file: File) => void;
  onSavePhotos: () => void;

  profileLoading: boolean;
  coverLoading: boolean;
  uploadError?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  avatarUrl = defaultAvatar,
  coverUrl = defaultCoverImage,
  onProfileSelect,
  onCoverSelect,
  onSavePhotos,
  profileLoading,
  coverLoading,
  uploadError,
}) => {
  const profileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  return (
    <div className="profile-card">
      {/* hidden inputs */}
      <input
        type="file"
        accept="image/*"
        ref={coverRef}
        style={{ display: "none" }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const f = e.target.files?.[0];
          if (f) onCoverSelect(f);
          e.target.value = "";
        }}
      />
      <input
        type="file"
        accept="image/*"
        ref={profileRef}
        style={{ display: "none" }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const f = e.target.files?.[0];
          if (f) onProfileSelect(f);
          e.target.value = "";
        }}
      />

      {/* cover + controles */}
      <div
        className="profile-card__cover"
        style={{ backgroundImage: `url(${coverUrl})` }}
      />

      <button
        className="profile-card__edit-cover"
        onClick={() => coverRef.current?.click()}
      >
        <Pencil size={18} />
      </button>

      <button
        className="profile-card__save-photos"
        onClick={onSavePhotos}
        disabled={profileLoading || coverLoading}
      >
        {profileLoading || coverLoading ? (
          <span className="profile-card__saving">...</span>
        ) : (
          <Save size={18} />
        )}
      </button>

      {/* conteúdo abaixo da capa */}
      <div className="profile-card__content">
        <div className="profile-card__avatar-container">
          <img src={avatarUrl} alt={name} className="profile-card__avatar" />
          <button
            className="profile-card__edit-avatar"
            onClick={() => profileRef.current?.click()}
          >
            <Pencil size={14} />
          </button>
        </div>
        <div className="profile-card__info">
          <h2 className="profile-card__name">{name}</h2>
          <p className="profile-card__role">{role}</p>
        </div>
        {uploadError && (
          <div className="profile-card__error">{uploadError}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
