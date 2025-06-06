import { useState, useEffect } from "react";
import api from "../services/api";
import { usuariologin } from "../services/login/login";
import { autenticacaoUsuario } from "../services/login/autenticacaoUsuario";
import type { AutenticacaoUsuarioResponse } from "../types/login/useAutenticacaoUsuario";
import type { LoginResponse } from "../types/login/useLogin";

export interface UserData {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: string;
  abilityRules: { action: string; subject: string }[];
  perfilAcompanhanteID?: number;
}

let sharedUser: UserData | null = null;

const subscribers = new Set<(u: UserData | null) => void>();

function updateSharedUser(newUser: UserData | null) {
  sharedUser = newUser;
  subscribers.forEach((cb) => cb(sharedUser));
}

interface UseAuthReturn {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [userState, setUserState] = useState<UserData | null>(sharedUser);
  const [loading, setLoading] = useState<boolean>(sharedUser === null);

  useEffect(() => {
    function onUserChange(u: UserData | null) {
      setUserState(u);
    }
    subscribers.add(onUserChange);

    if (sharedUser === null) {
      checkAuth();
    } else {
      // já tínhamos o valor em sharedUser, então loading=false
      setLoading(false);
    }

    return () => {
      subscribers.delete(onUserChange);
    };
  }, []);

  async function checkAuth() {
    setLoading(true);
    try {
      const response: AutenticacaoUsuarioResponse = await autenticacaoUsuario();
      const { userData } = response;
      updateSharedUser(userData);
    } catch {
      updateSharedUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const loginResponse: LoginResponse = await usuariologin({
        email,
        password,
      });
      const { userData } = loginResponse;
      updateSharedUser(userData);
    } catch (err) {
      updateSharedUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await api.post("/auth/logout", null);
    } catch {
      // mesmo que falhe, garantimos limpeza local
    } finally {
      updateSharedUser(null);
      setLoading(false);
    }
  }

  return {
    user: userState,
    loading,
    login,
    logout,
    checkAuth,
  };
}
