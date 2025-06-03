import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import "../styles/profile.scss";

import {
  uploadUserPhotos,
  PhotoUploadResponse,
} from "../services/profile/usuario/userUploadFotosPerfil";
import { fetchCurrentUserProfile } from "../services/profile/usuario/userGetUsuario";
import { atualizarPerfilAcompanhante } from "../services/profile/acompanhante/atualizarInformacaoPerfilAcompanhante";

import type { UserProfile } from "../types/userProfile";
import type { AtualizarPerfilAcompanhanteDto } from "../types/perfilAcompanhante/useAtualizarInformacaoPerfilAcompanhante";
import type { PerfilAcompanhanteResponse } from "../types/usePerfilAcompanhante";

import { useAuth } from "../hooks/useAuth";
import { alterarSenha } from "../services/login/userAlterarSenhaLogado";
import type {
  AlterarSenhaDTO,
} from "../types/userAlterarSenhaLogado";

import api from "../services/api";
import axios from "axios";

interface ValidationErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [perfilError, setPerfilError] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [perfilAcompanhante, setPerfilAcompanhante] = useState<PerfilAcompanhanteResponse | null>(null);

  const [profileUrl, setProfileUrl] = useState<string | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);

  const [descricao, setDescricao] = useState<string>("");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [infoError, setInfoError] = useState<string>("");
  const [infoSuccess, setInfoSuccess] = useState<string>("");

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return setLoadingPerfil(false);
      try {
        const uData: UserProfile = await fetchCurrentUserProfile();
        setUserProfile(uData);
        setProfileUrl(uData.fotoPerfilUrl ?? undefined);
        setCoverUrl(uData.fotoCapaUrl ?? undefined);
        setTelefone(uData.telefone ?? "");

        const { data: allPerfis } = await api.get<PerfilAcompanhanteResponse[]>(
          "/perfis/all",
          { withCredentials: true }
        );
        const meuPerfil = allPerfis.find((p) => p.usuarioID === uData.usuarioID) ?? null;
        setPerfilAcompanhante(meuPerfil);

        setDescricao(meuPerfil?.descricao ?? uData.descricao ?? "");
        setLocalizacao(meuPerfil?.localizacao ?? uData.localizacao ?? "");
      } catch (err) {
        console.error("[Profile] Erro ao carregar perfil completo:", err);
        setPerfilError("Não foi possível carregar seu perfil. Tente recarregar a página.");
      } finally {
        setLoadingPerfil(false);
      }
    }

    setLoadingPerfil(true);
    loadProfile();
  }, [user]);

  const handleProfileSelect = (file: File) => {
    setProfileFile(file);
    setProfileUrl(URL.createObjectURL(file));
  };
  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    setCoverUrl(URL.createObjectURL(file));
  };

  const handleSavePhotos = async () => {
    if (!user || (!profileFile && !coverFile))
      return setUploadError("Selecione ao menos uma imagem.");

    setUploadError("");
    setUploadLoading(true);
    try {
      const result: PhotoUploadResponse = await uploadUserPhotos(user.id, {
        profilePhoto: profileFile ?? undefined,
        coverPhoto: coverFile ?? undefined,
      });
      if (result.fotoPerfilUrl) setProfileUrl(result.fotoPerfilUrl);
      if (result.fotoCapaUrl) setCoverUrl(result.fotoCapaUrl);
      setProfileFile(null);
      setCoverFile(null);
    } catch (err) {
      let msg = "Erro no upload das fotos.";
      if (axios.isAxiosError(err) && err.response?.data?.message)
        msg = err.response.data.message;
      setUploadError(msg);
      console.error("[Profile] Erro no upload de fotos:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!userProfile || !perfilAcompanhante) {
      setInfoError("Dados incompletos para atualizar o perfil.");
      return;
    }

    setInfoLoading(true);
    setInfoError("");
    setInfoSuccess("");

    try {
      const payload: AtualizarPerfilAcompanhanteDto = {
        perfilAcompanhanteID: perfilAcompanhante.perfilAcompanhanteID,
        usuarioID: perfilAcompanhante.usuarioID,
        descricao,
        localizacao,
        tarifa: perfilAcompanhante.tarifa ?? 0,
        telefone: telefone ?? perfilAcompanhante.telefone,
        estaOnline: perfilAcompanhante.estaOnline ?? true,
        ultimoAcesso: perfilAcompanhante.ultimoAcesso ?? new Date().toISOString(),
        ultimoIP: perfilAcompanhante.ultimoIP ?? "0.0.0.0",
      };

      await atualizarPerfilAcompanhante(
        perfilAcompanhante.perfilAcompanhanteID,
        payload
      );
      setInfoSuccess("Informações atualizadas com sucesso!");
    } catch (err) {
      let msg = "Erro ao salvar informações.";
      if (axios.isAxiosError(err) && err.response?.data) {
        const body = err.response.data as ValidationErrorResponse;
        if (body.errors) msg = Object.values(body.errors).flat().join("; ");
        else if (body.message) msg = body.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setInfoError(msg);
      console.error("[Profile] Erro ao salvar informações pessoais:", err);
    } finally {
      setInfoLoading(false);
    }
  };

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
      if (response.errors?.length) setErrors(response.errors);
      else {
        setSuccessMessage(response.message ?? "Senha alterada com sucesso!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err: unknown) {
      console.error("[Profile] Erro ao chamar alterarSenha:", err);

      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ValidationErrorResponse;
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat();
          setErrors(allErrors);
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

  if (authLoading || loadingPerfil)
    return <div className="profile-page">Carregando perfil...</div>;

  if (perfilError)
    return (
      <div className="profile-page">
        <p style={{ color: "red" }}>{perfilError}</p>
      </div>
    );

  if (!userProfile || (!perfilAcompanhante && !userProfile.descricao && !userProfile.localizacao)) {
    return (
      <div className="profile-page">
        <p>
          Você ainda não possui um perfil de acompanhante.
          <br />
          Preencha o formulário inicial para criar seu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section id="perfil">
        <ProfileCard
          name={perfilAcompanhante?.nome ?? userProfile.nome}
          role={userProfile.role ?? ""}
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

      <section id="info" className="info-section">
        <h2>Informações Pessoais</h2>
        {infoError && <div className="message error">{infoError}</div>}
        {infoSuccess && <div className="message success">{infoSuccess}</div>}

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
          <label htmlFor="location">Localização</label>
          <input
            id="location"
            type="text"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefone</label>
          <input
            id="phone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <button
          className="btn-save-info"
          onClick={handleSaveInfo}
          disabled={infoLoading}
        >
          {infoLoading ? "Salvando..." : "Salvar Informações"}
        </button>
      </section>

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
