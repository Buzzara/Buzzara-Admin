import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard";
import { useAuth } from "../context/AuthContext"; 
import Profile from "../pages/Profile";
import AnunciosPage from "../pages/AnunciosPage";
import SupportPage from "../pages/SupportPage";
import HistoricoComprasPage from "../pages/HistoricoComprasPage";

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth(); // Obter isAuthenticated e loading

  // Se ainda estiver carregando, não renderizar as rotas ainda
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rotas protegidas dentro do Layout */}
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} /> {/* Redireciona / para /dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="historico-de-compras" element={<HistoricoComprasPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="anuncios" element={<AnunciosPage />} />
        <Route path="suporte" element={<SupportPage />} />
      </Route>

      {/* Rota curinga para redirecionamento */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}