import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Wallet,
  User,
  Landmark,
  Wrench,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "../Sidebar/sidebar.scss";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Definir saudação conforme horário
  const [greeting, setGreeting] = useState<string>("");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  // Definição de itens do menu
  const allMenu = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    {
      icon: <Wallet size={20} />,
      label: "Histórico de compras",
      path: "/historico-de-compras",
    },
    { icon: <User size={20} />, label: "Conta", path: "/profile" },
    { icon: <Landmark size={20} />, label: "Anúncios", path: "/anuncios" },
    { icon: <Wrench size={20} />, label: "Suporte", path: "/suporte" },
  ];

  // Se desejar filtros de permissão:
  const menuItems = allMenu; // ou filtre conforme user?.role

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST", credentials: "include" });
      await logout();
    } catch {
      console.error("Erro ao fazer logout");
    } finally {
      navigate("/login");
    }
  };

  const sidebarContent = (
    <>
      <div className="logo">
        <img src="/logo.svg" alt="Logo" />
      </div>
      <div className="sidebar-greeting">
        <span role="img" aria-label="wave">
          👋 {greeting},
        </span>
        <span className="username">{user?.nome}!</span>
      </div>

      <nav>
        <ul>
          {menuItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `menu-item ${isActive ? "active" : ""}`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar fixa para desktop */}
      <aside className="sidebar sidebar--fixed">{sidebarContent}</aside>

      {/* Botão hambúrguer mobile */}
      <button
        className="mobile-hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {/* Drawer em overlay mobile */}
      <div className={`sidebar-overlay ${isOpen ? "visible" : ""}`}>
        <aside className="sidebar sidebar--drawer">
          <header className="sidebar__mobile-header">
            <button
              className="sidebar__close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </header>
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}
