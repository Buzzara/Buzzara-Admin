import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import "../styles/dashboard.scss";

import { buscarAnuncio } from "../services/anuncio/buscarAnuncio";
import type { userBuscaAnuncioResponse } from "../types/anuncio/useBuscaAnuncio";

import { ModalObrigatorioPerfil } from "../components/ModalObrigatorioPerfil/ModalObrigatorioPerfil";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading, checkAuth } = useAuth();

  const [totalAds, setTotalAds] = useState(0);
  const [activeAds, setActiveAds] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data: userBuscaAnuncioResponse[] = await buscarAnuncio();
        setTotalAds(data.length);
        setActiveAds(data.length);
        const photosCount = data.reduce(
          (sum, item) => sum + (item.fotos?.length || 0),
          0
        );
        const videosCount = data.reduce(
          (sum, item) => sum + (item.videos?.length || 0),
          0
        );
        setTotalPhotos(photosCount);
        setTotalVideos(videosCount);
      } catch (err) {
        console.error("Erro ao carregar métricas:", err);
      }
    }
    loadMetrics();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      setShowModal(false);
      return;
    }

    setShowModal(user.ativo === false);
  }, [user, isAuthenticated, authLoading]);

  useEffect(() => {
    console.log("[Dashboard] isAuthenticated:", isAuthenticated);
    console.log("[Dashboard] user:", user);
    console.log("[Dashboard] showModal:", showModal);
  }, [isAuthenticated, user, showModal]);

  const handleSaveProfile = async (data: {
    descricao: string;
    cep: string;
    cidade: string;
  }) => {
    try {
      console.log("[Dashboard] Salvando perfil no backend:", data);

      await fetch("https://api.buzzara.com.br/users/me/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      await checkAuth();

      setShowModal(false);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert("Não foi possível salvar o perfil. Tente novamente.");
    }
  };

  if (authLoading) {
    return <div>Carregando usuário...</div>;
  }

  return (
    <div className="dashboard-container">
      {isAuthenticated && user && user.ativo === false && (
        <ModalObrigatorioPerfil isOpen={showModal} onSave={handleSaveProfile} />
      )}

      <h1>Dashboard de Anúncios</h1>

      <div className="card-grid">
        <div className="card">
          <h3>Total de Anúncios</h3>
          <p>{totalAds}</p>
        </div>
        <div className="card">
          <h3>Anúncios Ativos</h3>
          <p>{activeAds}</p>
        </div>
        <div className="card">
          <h3>
            Fotos <ImageIcon size={16} />
          </h3>
          <p>{totalPhotos}</p>
        </div>
        <div className="card">
          <h3>
            Vídeos <VideoIcon size={16} />
          </h3>
          <p>{totalVideos}</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card" key="views">
          <h3>Visualizações por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={[
                { day: "01", views: 120 },
                { day: "05", views: 240 },
                { day: "10", views: 180 },
                { day: "15", views: 300 },
                { day: "20", views: 260 },
                { day: "25", views: 320 },
                { day: "30", views: 290 },
              ]}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradientViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#50fa7b" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#50fa7b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#44475a" strokeDasharray="5 5" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#f8f8f2" }}
                axisLine={{ stroke: "#6272a4" }}
              />
              <YAxis
                tick={{ fill: "#f8f8f2" }}
                axisLine={{ stroke: "#6272a4" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#282a36",
                  border: "1px solid #6272a4",
                }}
                labelStyle={{ color: "#f8f8f2" }}
                itemStyle={{ color: "#50fa7b" }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#50fa7b"
                strokeWidth={2}
                fill="url(#gradientViews)"
                dot={{ fill: "#50fa7b", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" key="source">
          <h3>Origem das Visitas</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                wrapperStyle={{ color: "#f8f8f2" }}
              />
              <Pie
                data={[
                  { name: "Orgânico", value: 500 },
                  { name: "Ads", value: 300 },
                  { name: "Indicação", value: 200 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {["#27df6d", "#6a64d6", "#f3bb4b"].map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#282a36",
                  border: "1px solid #6272a4",
                }}
                itemStyle={{ color: "#ffb86c" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" key="cities">
          <h3>Top Cidades</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={[
                { city: "São Paulo", visits: 400 },
                { city: "Rio de Janeiro", visits: 320 },
                { city: "Belo Horizonte", visits: 180 },
                { city: "Curitiba", visits: 220 },
                { city: "Porto Alegre", visits: 150 },
              ]}
              margin={{ top: 40, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#44475a" strokeDasharray="4 4" />
              <XAxis
                dataKey="city"
                tick={{ fill: "#f8f8f2", fontSize: 12 }}
                axisLine={{ stroke: "#6272a4" }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "#f8f8f2" }}
                axisLine={{ stroke: "#6272a4" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#282a36",
                  border: "1px solid #6272a4",
                }}
                itemStyle={{ color: "#8be9fd" }}
              />
              <Bar dataKey="visits" barSize={40} radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="visits"
                  position="top"
                  fill="#f8f8f2"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
