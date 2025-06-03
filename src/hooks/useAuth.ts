// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import api from "../services/api"; // sua instância axios com withCredentials:true
import { userLogin } from "../services/login/userLogin";
import { authUser } from "../services/login/authUser";
import type { AuthUserResponse } from "../types/authUser";
import type { UserLoginResponse } from "../types/userLoginTypes";

/**
 * Interface do objeto de usuário que vamos manter:
 * (mesmo que antes usávamos em Context, agora fica aqui)
 */
export interface UserData {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: string;
  abilityRules: { action: string; subject: string }[];
  perfilAcompanhanteID?: number;
}

/**
 * Se quisermos que TODOS os componentes compartilhem o MESMO estado de "user",
 * basta manter uma variável fora do hook, dentro deste módulo (singleton).
 */
let sharedUser: UserData | null = null;

/**
 * Lista de callbacks para notificar componentes que o usuário mudou.
 */
const subscribers = new Set<(u: UserData | null) => void>();

/**
 * Função interna para atualizar o sharedUser e notificar todos os inscritos.
 */
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

/**
 * useAuth()
 *
 * - Faz GET /auth/me imediatamente (via authUser) na montagem do primeiro consumidor
 * - Expõe `user`, `loading`, `login()` e `logout()`
 * - Compartilha um único estado de `user` entre todos os componentes que chamam o hook
 */
export function useAuth(): UseAuthReturn {
  const [userState, setUserState] = useState<UserData | null>(sharedUser);
  const [loading, setLoading] = useState<boolean>(sharedUser === null);

  // Ao montar, inscreve-se para alterações no sharedUser
  useEffect(() => {
    function onUserChange(u: UserData | null) {
      setUserState(u);
    }
    subscribers.add(onUserChange);

    // Se ainda não carregamos (sharedUser === null), faça checkAuth()
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

  /**
   * Faz GET /auth/me para validar cookies e recuperar dados do usuário.
   * Se der certo, popula sharedUser; senão, torna-o `null`.
   */
  async function checkAuth() {
    setLoading(true);
    try {
      const response: AuthUserResponse = await authUser();
      const { userData } = response;
      updateSharedUser(userData);
    } catch {
      updateSharedUser(null);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Faz login (POST /auth/login), recebe { userData, tokens… }
   * e salva em sharedUser. Assume que userLogin() já lida com cookies.
   */
  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const loginResponse: UserLoginResponse = await userLogin({ email, password });
      const { userData } = loginResponse;
      updateSharedUser(userData);
    } catch (err) {
      updateSharedUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Faz logout (POST /auth/logout), limpa sharedUser e
   * remove cookies (via backend).
   */
  async function logout() {
    setLoading(true);
    try {
      await api.post("/auth/logout", null); // assume que esse endpoint invalida a sessão/cookie
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
