// src/components/Anuncio/sections/OndeAnunciarSection.tsx
import React from "react";
import InputField from "../InputField";
import MultiSelectField from "../MultiSelectField";
import { Estado } from "../../../types/localizacao/useEstado";

interface OndeAnunciarProps {
  tipoUsuario: "Garota" | "Trans" | "Homem";
  setTipoUsuario: (v: "Garota" | "Trans" | "Homem") => void;
  todasCategorias: string[];
  categoriasSelecionadas: string[];
  setCategoriasSelecionadas: (arr: string[]) => void;
  buscaLivre: string;
  setBuscaLivre: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
  estado: string;
  setEstado: (v: string) => void;
  cidade: string;
  setCidade: (v: string) => void;
  estadosLista: Estado[];
  cidadesPorEstado: string[];
  setCidadesPorEstado: (arr: string[]) => void;
  saidasA: string[];
  setSaidasA: (arr: string[]) => void;
}

const OndeAnunciarSection: React.FC<OndeAnunciarProps> = ({
  tipoUsuario,
  setTipoUsuario,
  todasCategorias,
  categoriasSelecionadas,
  setCategoriasSelecionadas,
  buscaLivre,
  setBuscaLivre,
  area,
  setArea,
  estado,
  setEstado,
  cidade,
  setCidade,
  estadosLista,
  cidadesPorEstado,
  setCidadesPorEstado,
  saidasA,
  setSaidasA,
}) => {
  // toda vez que “estado” mudar, buscamos as cidades no IBGE
  React.useEffect(() => {
    if (!estado) {
      setCidadesPorEstado([]);
      return;
    }
    const fetchCidades = async () => {
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
        );
        const data = await res.json();
        const nomes: string[] = data.map((obj: any) => obj.nome);
        setCidadesPorEstado(nomes.sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.error("❌ Erro ao buscar cidades:", err);
        setCidadesPorEstado([]);
      }
    };
    fetchCidades();
  }, [estado, setCidadesPorEstado]);

  // troca de categoria
  const toggleCategoria = (cat: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div
      className="modal__section"
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}
    >
      <h3 className="modal__section-title">Onde anunciar‐se</h3>
      
      {/* 3) Pesquisa livre */}
      <div className="modal__subsection" style={{ marginBottom: "12px" }}>
        <span className="modal__small-label">
          Pesquisa facilmente a tua cidade ou bairro
        </span>
        <input
          type="text"
          className="modal__input"
          placeholder="Ex.: Passa Quatro, Minas Gerais"
          value={buscaLivre}
          onChange={(e) => setBuscaLivre(e.target.value)}
          style={{ marginTop: "4px" }}
        />
      </div>

      {/* 4) Estado → Cidade */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <InputField label="Estado" >
            <select
              className="modal__input"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Selecione o estado</option>
              {estadosLista.map((st) => (
                <option key={st.id} value={st.sigla}>
                  {st.nome}
                </option>
              ))}
            </select>
          </InputField>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <InputField label="Cidade" >
            <select
              className="modal__input"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              disabled={!estado}
            >
              <option value="">
                {estado ? "Selecione a cidade" : "Escolha o estado"}
              </option>
              {cidadesPorEstado.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
          </InputField>
        </div>
      </div>

      {/* 5) Área (Opcional) */}
      <div style={{ marginBottom: "12px" }}>
        <InputField
          label="Área (Opcional)"
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required={false}
          placeholder="Ex.: Centro, Bairro XYZ"
        />
      </div>

      {/* 6) Saídas a (multi-select) */}
      <div style={{ marginBottom: "0px" }}>
        <MultiSelectField
          label="Saídas a"
          options={cidadesPorEstado.map((ct) => ({
            value: ct,
            label: ct,
          }))}
          values={saidasA}
          onChange={(selected) =>
            setSaidasA(selected ? selected.map((o) => o.value) : [])
          }
          placeholder={
            cidadesPorEstado.length
              ? "Selecione as cidades"
              : "Escolha o estado acima"
          }
          className={cidadesPorEstado.length ? "" : "disabled"}
        />
      </div>
    </div>
  );
};

export default OndeAnunciarSection;
