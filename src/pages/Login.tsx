// src/pages/Login.tsx
import "../styles/login.scss";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const images = [
    "../src/assets/image/banner.png",
    "../src/assets/image/banner2.png",
    "../src/assets/image/banner3.png",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Slide de imagens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Handler do form de login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.message && typeof err.message === "string"
          ? err.message
          : "E-mail ou senha inválidos";
      setError(message);
    }
  }

  return (
    <div className="login-container">
      <div
        className="login-left"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease-in-out",
        }}
      />

      <div className="login-right">
        <div className="login-content">
          <img src="/logo.svg" alt="Buzzara logo" className="logo" />

          <h2>Acesse a plataforma</h2>
          <p>Faça login ou registre-se para começar.</p>

          <form onSubmit={handleLogin}>
            {error && (
              <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>
            )}

            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Senha</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div className="forgot">
              <a href="#">Esqueceu a senha?</a>
            </div>

            <button type="submit">Entrar</button>
          </form>

          <div className="signup">
            Ainda não tem uma conta? <a href="/registro">Inscreva-se</a>
          </div>
        </div>
      </div>
    </div>
  );
}
