import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userLogin } from "../services/login/userLogin";
import { authUser } from "../services/login/authUser";

interface UserData {
  id: number;
  nome: string;
  email: string;
  role: string;
  abilityRules: { action: string; subject: string }[];
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1) Valida sessão ao montar
  const checkAuth = async () => {
    setLoading(true);
    try {
      const { userData } = await authUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 2) Faz login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await userLogin({ email, password });
      const { userData } = await authUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3) Faz logout
  const logout = async () => {
    setLoading(true);
    try {
      // opcional: chamar endpoint de logout para limpar cookies no servidor
      await fetch("/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // 4) Ao montar, verifica auth
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
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

// Hook de consumo
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
};
