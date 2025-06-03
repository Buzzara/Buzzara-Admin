// src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api"; // sua instância Axios configurada em src/services/api
import { userLogin } from "../services/login/userLogin";
import { authUser } from "../services/login/authUser";
import type { AuthUserResponse } from "../types/authUser";
import type { UserLoginResponse } from "../types/userLoginTypes";

/**
 *  1) Interface que armazena tudo que o contexto conhece sobre o usuário:
 *     - id, nome, email, role, ativo, abilityRules (vindo de /auth/me)
 *     - perfilAcompanhanteID (vindo de /auth/me OU indefinido até que o modal crie um novo perfil)
 */
interface UserData {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: string;
  abilityRules: { action: string; subject: string }[];

  // ← esse campo pode vir do /auth/me (se existir) ou ser setado depois
  perfilAcompanhanteID?: number;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   *  checkAuth(): quando montamos o Context pela primeira vez,
   *  fazemos GET /auth/me (via authUser()) e preenchemos os dados de user
   *  (incluindo possível perfilAcompanhanteID). Se der 401, jogamos user para null.
   */
  const checkAuth = async () => {
    setLoading(true);
    try {
      // authUser() deve chamar GET /auth/me e devolver { userData: { ... } }
      const response: AuthUserResponse = await authUser();
      const { userData } = response;
      setUser(userData);
    } catch (err) {
      // Se deu erro (ex: 401 Unauthorized), limpamos user
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   *  login(): faz userLogin({ email, password }) → o backend devolve
   *  { accessToken, refreshToken, userData: { id, nome, email, role, ativo, abilityRules, perfilAcompanhanteID? } }
   *  Então já armazenamos esse userData no state.  
   *  Os tokens (HttpOnly) ficam sendo gerenciados pelo cookie “withCredentials”.
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse: UserLoginResponse = await userLogin({ email, password });
      const { userData } = loginResponse;
      setUser(userData);
    } catch (err) {
      setUser(null);
      throw err; // O componente que chamou o login pode tratar mensagem de erro
    } finally {
      setLoading(false);
    }
  };

  /**
   *  logout(): chama /auth/logout (via POST) e limpa o user do contexto.
   *  Mesmo se falhar a requisição, garantimos que user = null.
   */
  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout", null);  // assume que /auth/logout invalida o cookie
    } catch {
      // se falhar, não bloqueamos o logout – limpamos o estado de qualquer forma
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  /**
   *  setPerfilAcompanhanteID: caso em algum momento você precise gravar
   *  perfilAcompanhanteID no estado local (por exemplo, logo após criar um novo perfil),
   *  este método faz merge no user.
   */
  const setPerfilAcompanhanteID = (id: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        perfilAcompanhanteID: id,
      };
    });
  };

  // Assim que o AuthProvider monta, rodamos a checagem inicial de sessão:
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
      {loading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
};
