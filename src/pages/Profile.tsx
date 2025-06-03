// src/pages/Profile.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import "../styles/profile.scss";

import {
  uploadUserPhotos,
  PhotoUploadResponse,
} from "../services/profile/usuario/userUploadFotosPerfil";

import { fetchCurrentUserProfile } from "../services/profile/usuario/userGetUsuario";
import type { UserProfile } from "../types/userProfile";

import { getPerfilById } from "../services/profile/acompanhante/buscarPerfilAcompanhante";
import type { PerfilAcompanhanteResponse } from "../types/usePerfilAcompanhante";
import type {
  AtualizarPerfilAcompanhanteDto,
} from "../types/perfilAcompanhante/useAtualizarInformacaoPerfilAcompanhante";

import { useAuth } from "../hooks/useAuth"; // seu hook customizado de autenticação
import { alterarSenha } from "../services/login/userAlterarSenhaLogado";
import { AlterarSenhaDTO, ApiResponse } from "../types/userAlterarSenhaLogado";

import api from "../services/api";
import axios from "axios";

type ValidationErrorResponse = {
  message?: string;
  errors: Record<string, string[]>;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Estado de carregamento interno para GET /usuarios/me e GET /perfis/{usuarioID}
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [perfilError, setPerfilError] = useState<string>("");

  // URLs das fotos
  const [profileUrl, setProfileUrl] = useState<string | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);

  // Objeto completo do perfil de acompanhante (GET /perfis/{usuarioID})
  const [perfilData, setPerfilData] = useState<PerfilAcompanhanteResponse | null>(null);

  // Campos editáveis
  const [descricao, setDescricao] = useState<string>("");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  // Upload de fotos
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  // Salvar informações pessoais
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [infoError, setInfoError] = useState<string>("");
  const [infoSuccess, setInfoSuccess] = useState<string>("");

  // Alterar senha
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  //
  // 1) Enquanto authLoading for true, aguardamos a resposta de /auth/me.
  // 2) Quando authLoading virar false, se `user` for null → redirecionamos para /login.
  //
  useEffect(() => {
    if (authLoading) return; // ainda aguardando /auth/me
    if (!user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  //
  // 3) Quando `user` estiver disponível (após /auth/me), buscamos os dados de `/usuarios/me`
  //    e, em seguida, usamos `userData.usuarioID` para chamar `/perfis/{usuarioID}`.
  //
  useEffect(() => {
    async function loadProfile() {
      // Se, por alguma razão, o user não existir, encerramos aqui
      if (!user) {
        setLoadingPerfil(false);
        return;
      }

      try {
        // 3.1) Buscar dados atuais do usuário (telefone e URLs de foto)
        const userData: UserProfile = await fetchCurrentUserProfile();
        setProfileUrl(userData.fotoPerfilUrl ?? undefined);
        setCoverUrl(userData.fotoCapaUrl ?? undefined);
        setTelefone(userData.telefone ?? "");

        // 3.2) Buscar perfil de acompanhante usando userData.usuarioID (não `user.id`, que vem null)
        const perfilResponse: PerfilAcompanhanteResponse = await getPerfilById(
          // ⬇ aqui usamos o usuário retornado pelo endpoint /usuarios/me
          userData.usuarioID
        );
        setPerfilData(perfilResponse);

        // Pré‐preenche os inputs com dados já existentes
        setDescricao(perfilResponse.descricao ?? "");
        setLocalizacao(perfilResponse.localizacao ?? "");
        // Caso o campo `telefone` venha também em perfilResponse, poderia usar:
        // setTelefone(perfilResponse.telefone ?? userData.telefone ?? "");
      } catch (err) {
        console.error("[Profile] Erro ao carregar perfil completo:", err);
        setPerfilError("Não foi possível carregar seu perfil.");
      } finally {
        setLoadingPerfil(false);
      }
    }

    // Só tentamos buscar perfil se `user` estiver definido
    if (user) {
      loadProfile();
    }
  }, [user]);

  //
  // Upload de fotos
  //
  const handleProfileSelect = (file: File) => {
    setProfileFile(file);
    setProfileUrl(URL.createObjectURL(file));
  };
  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    setCoverUrl(URL.createObjectURL(file));
  };
  const handleSavePhotos = async () => {
    if (!user) return; // sem usuário, não faz nada
    if (!profileFile && !coverFile) {
      setUploadError("Selecione ao menos uma imagem.");
      return;
    }
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
    } catch (err: unknown) {
      let msg = "Erro no upload";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setUploadError(msg);
      console.error("[Profile] Erro no upload de fotos:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  //
  // Salvar descrição / localização / telefone
  //
  const handleSaveInfo = async () => {
    if (!perfilData || !user) return;

    setInfoError("");
    setInfoSuccess("");
    setInfoLoading(true);

    try {
      const payloadParaPerfil: AtualizarPerfilAcompanhanteDto = {
        perfilAcompanhanteID: perfilData.perfilAcompanhanteID,
        usuarioID: perfilData.usuarioID,
        descricao: descricao,
        localizacao: localizacao,
        tarifa: perfilData.tarifa,
        telefone: telefone,
        estaOnline: perfilData.estaOnline,
        ultimoAcesso: perfilData.ultimoAcesso,
        ultimoIP: perfilData.ultimoIP,
      };

      // PUT /perfis/{perfilAcompanhanteID}
      await api.put(
        `/perfis/${perfilData.perfilAcompanhanteID}`,
        payloadParaPerfil
      );

      // Se você quiser atualizar o telefone no endpoint /usuarios/{id}, pode descomentar:
      // await api.put(`/usuarios/${user.id}`, { telefone });

      setInfoSuccess("Informações atualizadas com sucesso!");
    } catch (err: unknown) {
      let msg = "Erro ao salvar informações";
      if (axios.isAxiosError(err) && err.response?.data) {
        const validationBody = err.response.data as {
          title?: string;
          status?: number;
          errors?: Record<string, string[]>;
        };
        if (validationBody.errors) {
          msg = Object.values(validationBody.errors).flat().join("; ");
        } else if (validationBody.title) {
          msg = validationBody.title;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setInfoError(msg);
      console.error("[Profile] Erro ao salvar informações pessoais:", err);
    } finally {
      setInfoLoading(false);
    }
  };

  //
  // Alterar senha
  //
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
        const msg = response.message ?? "Senha alterada com sucesso!";
        setSuccessMessage(msg);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err: unknown) {
      console.error("[Profile] Erro ao chamar alterarSenha:", err);
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ApiResponse | ValidationErrorResponse;
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

  //
  // 4) Renderização condicional:
  //    — Enquanto authLoading OU loadingPerfil for true → “Carregando perfil…”
  //    — Se user for null, já foi redirecionado para /login acima
  //    — Se GET-perfil falhar → exibe mensagem de erro
  //    — Senão → exibe a página normalmente
  //
  if (authLoading || loadingPerfil) {
    return <div className="profile-page">Carregando perfil...</div>;
  }
  if (perfilError) {
    return (
      <div className="profile-page">
        <p style={{ color: "red" }}>{perfilError}</p>
      </div>
    );
  }
  if (!perfilData) {
    return <div className="profile-page">Nenhum perfil encontrado.</div>;
  }

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

        {/* Mensagens de erro ou sucesso ao salvar info */}
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
            type="text"
            id="location"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
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
        <button
          className="btn-save-info"
          onClick={handleSaveInfo}
          disabled={infoLoading}
        >
          {infoLoading ? "Salvando..." : "Salvar Informações"}
        </button>
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
