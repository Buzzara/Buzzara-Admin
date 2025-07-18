// src/components/Anuncio/sections/OndeAnunciarSection.tsx

import { useEffect, useState } from "react";
import MultiSelectField, { MultiSelectFieldOption } from "../MultiSelectField";
import { Estado } from "../../../types/localizacao/useEstado";

import { geocodeCidade } from "../../../services/localizacao/geocoding";
import { getLocalidadesProximas } from "../../../services/localizacao/localidadeProxima";
import { LocalidadeProximaResponse } from "../../../types/localizacao/useLocalidadeProxima";

interface MunicipioIBGE {
  nome: string;
}

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

export default function OndeAnunciarSection({
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
}: OndeAnunciarProps) {
  const [proximasOptions, setProximasOptions] = useState<
    MultiSelectFieldOption[]
  >([]);

  // 1) carregar lista de cidades quando estado muda
  useEffect(() => {
    if (!estado) {
      setCidadesPorEstado([]);
      return;
    }
    const fetchCidades = async () => {
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
        );
        const data = (await res.json()) as MunicipioIBGE[];
        const nomes = data.map((m) => m.nome);
        setCidadesPorEstado(nomes.sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.error("❌ Erro ao buscar cidades:", err);
        setCidadesPorEstado([]);
      }
    };
    fetchCidades();
  }, [estado, setCidadesPorEstado]);

  // 2) quando cidade é escolhida, geocode + proximidades
  useEffect(() => {
    if (!cidade || !estado) {
      setProximasOptions([]);
      setSaidasA([]);
      return;
    }

    (async () => {
      try {
        // Geocoding
        const { lat, lon } = await geocodeCidade(cidade, estado);

        // Busca localidades próximas
        const proximas = await getLocalidadesProximas({
          latitude: lat,
          longitude: lon,
        });

        // Mapeia para opções do MultiSelect
        const opts = proximas.map((loc: LocalidadeProximaResponse) => ({
          value: loc.nome,
          label: `${loc.nome} (${loc.distanciaKm.toFixed(2)} km)`,
        }));
        setProximasOptions(opts);
      } catch (err) {
        console.error("❌ Erro ao carregar localidades próximas:", err);
        setProximasOptions([]);
      }
    })();
  }, [cidade, estado, setSaidasA]);

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
      <h3 className="modal__section-title">Onde anunciar‑se</h3>

      {/* Busca Livre */}
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

      {/* Estado e Cidade */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <div className="modal__field">
            <label>Estado</label>
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
          </div>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <div className="modal__field">
            <label>Cidade</label>
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
          </div>
        </div>
      </div>

      {/* Área (Opcional) */}
      <div style={{ marginBottom: "12px" }}>
        <div className="modal__field">
          <label>Área (Opcional)</label>
          <input
            type="text"
            className="modal__input"
            placeholder="Ex.: Centro, Bairro XYZ"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
      </div>

      {/* Saídas a (multi-select) de localidades próximas */}
      <div style={{ marginBottom: "0px" }}>
        <MultiSelectField
          label="Saídas a"
          options={proximasOptions}
          values={saidasA}
          onChange={(selected) =>
            setSaidasA(selected ? selected.map((o) => o.value) : [])
          }
          placeholder={
            proximasOptions.length
              ? "Selecione as localidades próximas"
              : cidade
              ? "Carregando locais..."
              : "Selecione a cidade acima"
          }
        />
      </div>
    </div>
  );
}
