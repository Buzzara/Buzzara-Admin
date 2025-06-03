// src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userLogin } from "../services/login/userLogin";
import { authUser } from "../services/login/authUser";
import type { AuthUserResponse } from "../types/authUser";
import type { UserLoginResponse } from "../types/userLoginTypes";

interface UserData {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: string;
  abilityRules: { action: string; subject: string }[];
  /** Este campo é exatamente o “perfilAcompanhanteID” vindo de /auth/me ou criado depois **/
  perfilAcompanhanteID?: number | null;
}

interface AuthContextType {
  user: UserData | null;
  setPerfilAcompanhanteID: (id: number) => void;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1) Faz GET /auth/me e popula user (incluindo perfilAcompanhanteID, se existir)
  const checkAuth = async () => {
    setLoading(true);
    try {
      const response: AuthUserResponse = await authUser();
      // response.userData já deve vir com “perfilAcompanhanteID?” preenchido (ou null)
      setUser(response.userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 2) Faz login e já armazena o userData (com perfilAcompanhanteID, se o backend retornar)
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse: UserLoginResponse = await userLogin({
        email,
        password,
      });
      setUser(loginResponse.userData);
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3) Desloga (limpa cookie e limpa contexto)
  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // 4) Quando o modal cria um perfil novo (POST /perfis), vamos injetar esse perfil no contexto:
  const setPerfilAcompanhanteID = (id: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        perfilAcompanhanteID: id,
      };
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setPerfilAcompanhanteID,
        isAuthenticated: Boolean(user),
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {loading ? <div>Carregando autenticação...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
};
