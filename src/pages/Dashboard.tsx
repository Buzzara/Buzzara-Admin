// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
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
import {
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import "../styles/dashboard.scss";

import { userGetAnuncios } from "../services/anuncio/userBuscaAnuncio";
import { userGetAnuncioResponse } from "../types/userBuscaAnuncio";

export default function Dashboard() {
  // estado das métricas dinâmicas
  const [totalAds, setTotalAds] = useState(0);
  const [activeAds, setActiveAds] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);

  // (ainda mantemos mock para os gráficos)
  const viewsData = [
    { day: "01", views: 120 },
    { day: "05", views: 240 },
    { day: "10", views: 180 },
    { day: "15", views: 300 },
    { day: "20", views: 260 },
    { day: "25", views: 320 },
    { day: "30", views: 290 },
  ];

  const sourceData = [
    { name: "Orgânico", value: 500 },
    { name: "Ads", value: 300 },
    { name: "Indicação", value: 200 },
  ];

  const cityData = [
    { city: "São Paulo", visits: 400 },
    { city: "Rio de Janeiro", visits: 320 },
    { city: "Belo Horizonte", visits: 180 },
    { city: "Curitiba", visits: 220 },
    { city: "Porto Alegre", visits: 150 },
  ];

  const COLORS = ["#27df6d", "#6a64d6", "#f3bb4b"];

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data: userGetAnuncioResponse[] = await userGetAnuncios();
        
        setTotalAds(data.length);

        // aqui consideramos que todo anúncio retornado é "Ativo"
        // se você tiver o status no response, filtre por ele
        setActiveAds(data.filter(a => /* a.status === 'Ativo' */ true).length);

        // soma total de fotos e vídeos
        const photosCount = data.reduce((sum, a) => sum + (a.fotos?.length || 0), 0);
        const videosCount = data.reduce((sum, a) => sum + (a.videos?.length || 0), 0);

        setTotalPhotos(photosCount);
        setTotalVideos(videosCount);
      } catch (err) {
        console.error("Erro ao carregar anúncios:", err);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Anúncios</h1>

      {/* Cartões de Métricas */}
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
          <h3>Anúncios Pausados</h3>
          <p>—{/* caso tenha conteudo de pausados */}</p>
        </div>
        <div className="card">
          <h3>
            Fotos&nbsp;<ImageIcon size={16} />
          </h3>
          <p>{totalPhotos}</p>
        </div>
        <div className="card">
          <h3>
            Vídeos&nbsp;<VideoIcon size={16} />
          </h3>
          <p>{totalVideos}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div
        className="chart-grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "1.5rem" }}
      >
        {/* Visualizações por Dia */}
        <div className="chart-card">
          <h3>Visualizações por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#50fa7b" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#50fa7b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#44475a" strokeDasharray="5 5" />
              <XAxis dataKey="day" tick={{ fill: "#f8f8f2" }} axisLine={{ stroke: "#6272a4" }} />
              <YAxis tick={{ fill: "#f8f8f2" }} axisLine={{ stroke: "#6272a4" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#282a36", border: "1px solid #6272a4" }}
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

        {/* Origem das Visitas */}
        <div className="chart-card">
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
                data={sourceData}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sourceData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#282a36", border: "1px solid #6272a4" }}
                itemStyle={{ color: "#ffb86c" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cidades */}
        <div className="chart-card">
          <h3>Top Cidades</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cityData} margin={{ top: 40, right: 20, left: 0, bottom: 0 }}>
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
              <YAxis tick={{ fill: "#f8f8f2" }} axisLine={{ stroke: "#6272a4" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#282a36", border: "1px solid #6272a4" }}
                itemStyle={{ color: "#8be9fd" }}
              />
              <Bar dataKey="visits" fill="#8be9fd" barSize={40} radius={[6, 6, 0, 0]}>
                <LabelList dataKey="visits" position="top" fill="#f8f8f2" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
