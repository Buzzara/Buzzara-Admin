import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usuariologin } from "../services/login/login";
import { autenticacaoUsuario } from "../services/login/autenticacaoUsuario";
import type { AutenticacaoUsuarioResponse } from "../types/login/useAutenticacaoUsuario";
import type { LoginResponse } from "../types/login/useLogin";

interface UserData {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: string;
  abilityRules: { action: string; subject: string }[];
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

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response: AutenticacaoUsuarioResponse = await autenticacaoUsuario();
      setUser(response.userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse: LoginResponse = await usuariologin({
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
