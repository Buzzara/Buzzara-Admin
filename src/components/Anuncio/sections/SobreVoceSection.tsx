import React from "react";
import SelectField from "../SelectField";
import MultiSelectField from "../MultiSelectField";
import { Option } from "../servicosOptions";
import { MultiValue, SingleValue } from "react-select";
import {
  opcoesEtniaHomem,
  opcoesEstaturaHomem,
  opcoesCorpoHomem,
  opcoesPubisHomem,
} from "../sobreVoceOptions";

interface SobreVoce {
  atendimentoA: string[];
  etnia: string;
  cabelo: string;
  estatura: string;
  corpo: string;
  seios: string;
  pubis: string;
  rol: string[];
}

interface SobreVoceProps {
  sobreVoce: SobreVoce;
  setSobreVoce: React.Dispatch<React.SetStateAction<SobreVoce>>;
  opcoesAtendimentoA: Option[];
  opcoesEtnia: Option[];
  opcoesCabelo: Option[];
  opcoesEstatura: Option[];
  opcoesCorpo: Option[];
  opcoesSeios: Option[];
  opcoesPubis: Option[];
  opcoesRol: Option[];
  genero: string;
}

const SobreVoceSection: React.FC<SobreVoceProps> = ({
  sobreVoce,
  setSobreVoce,
  opcoesAtendimentoA,
  opcoesEtnia,
  opcoesCabelo,
  opcoesEstatura,
  opcoesCorpo,
  opcoesSeios,
  opcoesPubis,
  opcoesRol,
  genero,
}) => {
  const generoNormalizado = genero.toLowerCase();

  // 🪵 DEBUG LOGS
  console.log("🔍 GÊNERO RECEBIDO:", genero);
  console.log("🔍 GÊNERO NORMALIZADO:", generoNormalizado);
  console.log("📦 Opções de etnia:", generoNormalizado === "masculino" ? opcoesEtniaHomem : opcoesEtnia);
  console.log("📦 Opções de estatura:", generoNormalizado === "masculino" ? opcoesEstaturaHomem : opcoesEstatura);
  console.log("📦 Opções de corpo:", generoNormalizado === "masculino" ? opcoesCorpoHomem : opcoesCorpo);
  console.log("📦 Opções de púbis:", generoNormalizado === "masculino" ? opcoesPubisHomem : opcoesPubis);

  const makeMultiHandler =
    (key: keyof SobreVoce) => (selected: MultiValue<Option>) => {
      setSobreVoce((prev) => ({
        ...prev,
        [key]: selected.map((o) => o.value),
      }));
    };

  const makeSingleHandler =
    (key: keyof SobreVoce) => (selected: SingleValue<Option>) => {
      setSobreVoce((prev) => ({
        ...prev,
        [key]: selected ? selected.value : "",
      }));
    };

  const handleCorpoButtonClick = (valor: string) => {
    setSobreVoce((prev) => ({
      ...prev,
      corpo: valor,
    }));
  };

  return (
    <div
      className="modal__section"
      style={{
        border: "1px solid #ccc",
        padding: "25px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}
    >
      <h3 className="modal__section-title">Sobre você</h3>

      <MultiSelectField
        label="Atendimento a"
        options={opcoesAtendimentoA}
        values={sobreVoce.atendimentoA}
        onChange={makeMultiHandler("atendimentoA")}
      />

      <SelectField
        label="Etnia"
        options={generoNormalizado === "masculino" ? opcoesEtniaHomem : opcoesEtnia}
        value={sobreVoce.etnia}
        onChange={makeSingleHandler("etnia")}
      />

      <SelectField
        label="Cabelo"
        options={opcoesCabelo}
        value={sobreVoce.cabelo}
        onChange={makeSingleHandler("cabelo")}
      />

      <SelectField
        label="Estatura"
        options={generoNormalizado === "masculino" ? opcoesEstaturaHomem : opcoesEstatura}
        value={sobreVoce.estatura}
        onChange={makeSingleHandler("estatura")}
      />

      {generoNormalizado === "masculino" ? (
        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}>
            Corpo
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {opcoesCorpoHomem.map((opcao) => (
              <button
                type="button"
                key={opcao.value}
                onClick={() => handleCorpoButtonClick(opcao.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor:
                    sobreVoce.corpo === opcao.value ? "#ccc" : "transparent",
                  cursor: "pointer",
                }}
              >
                {opcao.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <SelectField
          label="Corpo"
          options={opcoesCorpo}
          value={sobreVoce.corpo}
          onChange={makeSingleHandler("corpo")}
        />
      )}

      {generoNormalizado !== "masculino" && (
        <SelectField
          label="Seios"
          options={opcoesSeios}
          value={sobreVoce.seios}
          onChange={makeSingleHandler("seios")}
        />
      )}

      <SelectField
        label="Púbis"
        options={generoNormalizado === "masculino" ? opcoesPubisHomem : opcoesPubis}
        value={sobreVoce.pubis}
        onChange={makeSingleHandler("pubis")}
      />

      {(generoNormalizado === "masculino" || generoNormalizado === "outro") && (
        <MultiSelectField
          label="Rol"
          options={opcoesRol}
          values={sobreVoce.rol}
          onChange={makeMultiHandler("rol")}
        />
      )}
    </div>
  );
};

export default SobreVoceSection;
