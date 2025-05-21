import React, { useState, ChangeEvent } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import "../styles/historicoComprasPage.scss";

interface Purchase {
  id: string;
  date: string;
  itemsCount: number;
  total: string;
  status: "Concluído" | "Pendente" | "Cancelado";
}

const FILTER_OPTIONS = ["Todos", "Concluído", "Pendente", "Cancelado"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

const mockPurchases: Purchase[] = [
  { id: "PED-1001", date: "2025-04-12", itemsCount: 3, total: "R$ 150,00", status: "Concluído" },
  { id: "PED-1002", date: "2025-04-10", itemsCount: 1, total: "R$ 45,00", status: "Pendente" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },
  { id: "PED-0999", date: "2025-04-05", itemsCount: 2, total: "R$ 80,00", status: "Cancelado" },

];

const HistoricoComprasPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("Todos");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as FilterOption);
  };

  const filtered = mockPurchases.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Todos" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="historico-page">
      <header className="historico-page__header">
        <h1>Histórico de Compras</h1>
      </header>

      <div className="historico-page__controls">
        <div className="search-wrapper">
          <Search size={16} className="icon-search" />
          <input
            type="text"
            placeholder="Buscar pedido por ID..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* wrapper do select + seta */}
        <div className="select-wrapper">
          <select value={filter} onChange={handleFilterChange}>
            {FILTER_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt === "Todos"
                  ? `${opt} (${mockPurchases.length})`
                  : opt}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="icon-arrow" />
        </div>
      </div>

      <div className="historico-page__table">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Data</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id + Math.random()}>
                <td>{p.id}</td>
                <td>{p.date}</td>
                <td>{p.itemsCount}</td>
                <td>{p.total}</td>
                <td className={`status status--${p.status.toLowerCase()}`}>
                  {p.status}
                </td>
                <td className="actions">
                  <button title="Visualizar">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="historico-page__pagination">
        <button disabled>Anterior</button>
        <span>1 de 1</span>
        <button disabled>Próximo</button>
      </div>
    </div>
  );
};

export default HistoricoComprasPage;
