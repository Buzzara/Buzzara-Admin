// src/hooks/useProfile.ts

import { useState, useEffect, useCallback } from "react";
import type { UserData } from "./useAuth";
import type { UserProfile } from "../types/userProfile";
import type { PerfilAcompanhanteResponse } from "../types/usePerfilAcompanhante";
import type { AtualizarPerfilAcompanhanteDto } from "../types/perfilAcompanhante/useAtualizarInformacaoPerfilAcompanhante";

import {
  getUserProfile,
  getPerfilAcompanhante,
  updateUserPhone,
  updatePerfilAcompanhante,
  uploadUserPhotos,
  changePassword,
} from "../services/profileService";

/**
 * Hooks: 
 * - Dá loading no perfil (/usuarios/{id} + /perfis/{perfilAcompanhanteID})
 * - Expõe funções para atualizar telefone, perfil, fotos e senha
 */
export function useProfile(user: UserData | null) {
  // ─── Estados de carregamento e erro ───
  const [isLoadingPerfil, setIsLoadingPerfil] = useState(true);
  const [perfilError, setPerfilError] = useState<string>("");

  // ─── Dados do próprio usuário e do perfil de acompanhante ───
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [perfilAcompanhante, setPerfilAcompanhante] = useState<PerfilAcompanhanteResponse | null>(null);

  // ─── Campos editáveis (local, desc, telefone), com seus erros/ações ───
  const [descricao, setDescricao] = useState<string>("");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState<string>("");
  const [infoSuccess, setInfoSuccess] = useState<string>("");

  // ─── Upload de fotos ───
  const [profileUrl, setProfileUrl] = useState<string | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  // ─── Mudança de senha ───
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [pwdErrors, setPwdErrors] = useState<string[]>([]);
  const [pwdSuccessMessage, setPwdSuccessMessage] = useState<string>("");

  // ───────────────────────────────────────────────────────────────
  // 1) Carrega os dados iniciais de perfil quando `user` muda:
  //    • GET /usuarios/{user.id}
  //    • Se houver user.perfilAcompanhanteID → GET /perfis/{id}
  //    • Preenche descr/local/tel/fotos
  // ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadProfileData() {
      if (!user) {
        setIsLoadingPerfil(false);
        return;
      }

      try {
        // 1.1) GET /usuarios/{user.id}
        const uData = await getUserProfile(user.id);
        setUserProfile(uData);
        setTelefone(uData.telefone ?? "");
        setProfileUrl(uData.fotoPerfilUrl ?? undefined);
        setCoverUrl(uData.fotoCapaUrl ?? undefined);

        // 1.2) GET /perfis/{perfilAcompanhanteID} se existir
        if (user.perfilAcompanhanteID) {
          const pData = await getPerfilAcompanhante(user.perfilAcompanhanteID);
          setPerfilAcompanhante(pData);
          setDescricao(pData.descricao ?? "");
          setLocalizacao(pData.localizacao ?? "");
        } else {
          // se não houver perfilAcompanhanteID, também limpamos
          setPerfilAcompanhante(null);
          setDescricao("");
          setLocalizacao("");
        }
      } catch (err: any) {
        console.error("[useProfile] Erro ao carregar perfil:", err);
        setPerfilError("Não foi possível carregar seu perfil. Recarregue a página.");
      } finally {
        setIsLoadingPerfil(false);
      }
    }

    setIsLoadingPerfil(true);
    loadProfileData();
  }, [user]);

  // ───────────────────────────────────────────────────────────────
  // 2) Função para “Salvar Informações Pessoais”
  //    → atualiza telefone e perfil de acompanhante (PUT /usuarios e PUT /perfis)
  // ───────────────────────────────────────────────────────────────
  const savePersonalInfo = useCallback(async () => {
    if (!user || !perfilAcompanhante) return;

    setInfoLoading(true);
    setInfoError("");
    setInfoSuccess("");

    try {
      // 2.1) Atualiza o telefone em /usuarios/{user.id}
      await updateUserPhone(user.id, telefone);

      // 2.2) Atualiza o perfil de acompanhante
      const payload: AtualizarPerfilAcompanhanteDto = {
        perfilAcompanhanteID: perfilAcompanhante.perfilAcompanhanteID,
        usuarioID: perfilAcompanhante.usuarioID,
        descricao,
        localizacao,
        tarifa: perfilAcompanhante.tarifa,
        telefone,
        estaOnline: perfilAcompanhante.estaOnline,
        ultimoAcesso: perfilAcompanhante.ultimoAcesso,
        ultimoIP: perfilAcompanhante.ultimoIP,
      };
      await updatePerfilAcompanhante(payload);

      setInfoSuccess("Informações atualizadas com sucesso!");
    } catch (err: any) {
      console.error("[useProfile] Erro ao salvar informações:", err);
      let msg = "Erro ao salvar informações.";
      if (err.isAxiosError && err.response?.data) {
        const body = err.response.data as {
          title?: string;
          errors?: Record<string, string[]>;
        };
        if (body.errors) msg = Object.values(body.errors).flat().join("; ");
        else if (body.title) msg = body.title;
      }
      setInfoError(msg);
    } finally {
      setInfoLoading(false);
    }
  }, [user, perfilAcompanhante, telefone, descricao, localizacao]);

  // ───────────────────────────────────────────────────────────────
  // 3) Funções para upload de fotos de avatar/capa
  // ───────────────────────────────────────────────────────────────
  const handleProfileSelect = (file: File) => {
    setProfileFile(file);
    setProfileUrl(URL.createObjectURL(file));
  };

  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    setCoverUrl(URL.createObjectURL(file));
  };

  const savePhotos = useCallback(async () => {
    if (!user) return;
    if (!profileFile && !coverFile) {
      setUploadError("Selecione ao menos uma imagem.");
      return;
    }

    setUploadError("");
    setUploadLoading(true);
    try {
      const result = await uploadUserPhotos(
        user.id,
        profileFile ?? undefined,
        coverFile ?? undefined
      );
      if (result.fotoPerfilUrl) setProfileUrl(result.fotoPerfilUrl);
      if (result.fotoCapaUrl) setCoverUrl(result.fotoCapaUrl);
      setProfileFile(null);
      setCoverFile(null);
    } catch (err: any) {
      console.error("[useProfile] Erro no upload de fotos:", err);
      let msg = "Erro no upload das fotos.";
      if (err.isAxiosError && err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setUploadError(msg);
    } finally {
      setUploadLoading(false);
    }
  }, [user, profileFile, coverFile]);

  // ───────────────────────────────────────────────────────────────
  // 4) Função para “Alterar Senha”
  // ───────────────────────────────────────────────────────────────
  const saveNewPassword = useCallback(async () => {
    setPwdErrors([]);
    setPwdSuccessMessage("");

    if (newPassword !== confirmNewPassword) {
      setPwdErrors(["A confirmação não confere com a nova senha."]);
      return;
    }
    try {
      const response = await changePassword({
        senhaAtual: oldPassword,
        novaSenha: newPassword,
        confirmarNovaSenha: confirmNewPassword,
      });
      if (response.errors?.length) {
        setPwdErrors(response.errors);
      } else {
        setPwdSuccessMessage(response.message ?? "Senha alterada com sucesso!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err: any) {
      console.error("[useProfile] Erro ao alterar senha:", err);
      if (err.isAxiosError && err.response?.data) {
        const data = err.response.data as ApiResponse | ValidationErrorResponse;
        if (Array.isArray((data as any).errors)) setPwdErrors((data as any).errors);
        else if ((data as any).errors) setPwdErrors(Object.values((data as any).errors).flat());
        else if ((data as any).message) setPwdErrors([(data as any).message]);
        else setPwdErrors(["Erro ao atualizar senha."]);
      } else {
        setPwdErrors(["Erro ao atualizar senha."]);
      }
    }
  }, [oldPassword, newPassword, confirmNewPassword]);

  return {
    // ─── dados / states ───
    isLoadingPerfil,
    perfilError,
    userProfile,
    perfilAcompanhante,
    descricao,
    localizacao,
    telefone,
    profileUrl,
    coverUrl,
    uploadError,
    uploadLoading,
    infoError,
    infoLoading,
    infoSuccess,
    oldPassword,
    newPassword,
    confirmNewPassword,
    pwdErrors,
    pwdSuccessMessage,

    // ─── setters ───
    setDescricao,
    setLocalizacao,
    setTelefone,
    setProfileFile: handleProfileSelect,
    setCoverFile: handleCoverSelect,
    setOldPassword,
    setNewPassword,
    setConfirmNewPassword,

    // ─── actions ───
    savePhotos,
    savePersonalInfo,
    saveNewPassword,
  };
}
