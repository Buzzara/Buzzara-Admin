import React, { useState, useEffect } from "react";
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

interface UserData {
  id: number;
  nome: string;
  email: string;
  role: string;
  abilityRules: { action: string; subject: string }[];
}

export default function Sidebar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Carrega papel do usuário do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user: UserData = JSON.parse(stored);
        setUserRole(user.role);
      } catch {
        console.error("Erro ao parsear usuário");
      }
    }
  }, []);

  // Definição de todas as opções de menu
  const allMenu = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Wallet size={20} />, label: "Historico de compras", path: "/historico-de-compras" },
    { icon: <User size={20} />, label: "Conta", path: "/profile" },
    { icon: <Landmark size={20} />, label: "Anuncios", path: "/anuncios" },
    { icon: <Wrench size={20} />, label: "Suporte", path: "/suporte" },
  ];

  // Filtra itens para não-admin
  const menuItems =
    userRole && userRole !== "admin"
      ? allMenu.filter(item => item.label !== "My Privileges" && item.label !== "Setting")
      : allMenu;

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

  // Conteúdo comum a ambas sidebars
  const sidebarContent = (
    <>
      <div className="logo">
        <img src="/logo.svg" alt="Logo" />
      </div>

      <nav>
        <ul>
          {menuItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
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
      {/* 1) Sidebar fixa para desktop */}
      <aside className="sidebar sidebar--fixed">{sidebarContent}</aside>

      {/* 2) Botão hambúrguer para mobile */}
      <button
        className="mobile-hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {/* 3) Overlay + drawer para mobile */}
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
