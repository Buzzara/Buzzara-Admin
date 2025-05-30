import React, { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import "../styles/profile.scss";

import {
  uploadUserPhotos,
  PhotoUploadResponse,
} from "../services/profile/usuario/userUploadFotosPerfil";

import { fetchCurrentUserProfile } from "../services/profile/usuario/userGetUsuario";
import type { UserProfile } from "../types/userProfile";

import { useAuth } from "../context/AuthContext";
import { alterarSenha } from "../services/login/userAlterarSenhaLogado";
import { AlterarSenhaDTO, ApiResponse } from "../types/userAlterarSenhaLogado";
import axios from "axios";

type ValidationErrorResponse = {
  message?: string;
  errors: Record<string, string[]>;
};

const Profile: React.FC = () => {
  const { user } = useAuth();

  // URLs das fotos
  const [profileUrl, setProfileUrl] = useState<string | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);

  // Dados adicionais
  const [descricao, setDescricao] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  // Estado de upload
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  // Estado de senha
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Carrega perfil
  useEffect(() => {
    async function loadProfile() {
      try {
        const data: UserProfile = await fetchCurrentUserProfile();
        setProfileUrl(data.fotoPerfilUrl ?? undefined);
        setCoverUrl(data.fotoCapaUrl ?? undefined);
        // setDescricao(data.descricao ?? "");
        setTelefone(data.telefone ?? "");
      } catch (err) {
        console.error("[Profile] error fetching profile:", err);
      }
    }
    loadProfile();
  }, []);

  // Seleção de arquivos
  const handleProfileSelect = (file: File) => {
    setProfileFile(file);
    setProfileUrl(URL.createObjectURL(file));
  };
  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    setCoverUrl(URL.createObjectURL(file));
  };

  // Envio de fotos
  const handleSavePhotos = async () => {
    if (!profileFile && !coverFile) {
      setUploadError("Selecione ao menos uma imagem.");
      return;
    }
    setUploadError(undefined);
    setUploadLoading(true);
    try {
      const result: PhotoUploadResponse = await uploadUserPhotos(user!.id, {
        profilePhoto: profileFile ?? undefined,
        coverPhoto: coverFile ?? undefined,
      });
      if (result.fotoPerfilUrl) setProfileUrl(result.fotoPerfilUrl);
      if (result.fotoCapaUrl) setCoverUrl(result.fotoCapaUrl);
      setProfileFile(null);
      setCoverFile(null);
    } catch (err: unknown) {
      let msg = "Erro no upload";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setUploadError(msg);
    } finally {
      setUploadLoading(false);
    }
  };

  // Alterar senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");

    if (newPassword !== confirmNewPassword) {
      setErrors(["A confirmação não confere com a nova senha."]);
      return;
    }

    const payload: AlterarSenhaDTO = {
      senhaAtual: oldPassword,
      novaSenha: newPassword,
      confirmarNovaSenha: confirmNewPassword,
    };

    try {
      const response = await alterarSenha(payload);
      if (response.errors?.length) {
        setErrors(response.errors);
      } else {
        setSuccessMessage(response.message ?? "Senha alterada com sucesso!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as
          | ApiResponse
          | ValidationErrorResponse;
        if (Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else if (data.errors) {
          setErrors(Object.values(data.errors).flat());
        } else if (data.message) {
          setErrors([data.message]);
        } else {
          setErrors(["Erro ao atualizar senha."]);
        }
      } else {
        setErrors(["Erro ao atualizar senha."]);
      }
    }
  };

  return (
    <div className="profile-page">
      {/* Seção Perfil (card) */}
      <section id="perfil">
        <ProfileCard
          name={user?.nome || ""}
          role={user?.role || ""}
          avatarUrl={profileUrl}
          coverUrl={coverUrl}
          onProfileSelect={handleProfileSelect}
          onCoverSelect={handleCoverSelect}
          onSavePhotos={handleSavePhotos}
          profileLoading={uploadLoading}
          coverLoading={uploadLoading}
          uploadError={uploadError}
        />
      </section>

      {/* Seção Informações Pessoais */}
      <section id="info" className="info-section">
        <h2>Informações Pessoais</h2>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefone</label>
          <input
            type="tel"
            id="phone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <button className="btn-save-info">Salvar Informações</button>
      </section>

      {/* Seção Segurança */}
      <section id="seguranca" className="security-section">
        <h2>Segurança</h2>
        <p>Altere sua senha e gerencie configurações de segurança.</p>

        <div className="form-messages">
          {errors.map((err, i) => (
            <div key={i} className="message error">
              {err}
            </div>
          ))}
          {successMessage && (
            <div className="message success">{successMessage}</div>
          )}
        </div>

        <form className="security-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Senha Atual</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-update-password">
            Atualizar Senha
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
