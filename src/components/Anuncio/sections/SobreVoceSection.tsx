import React from "react";
import SelectField from "../SelectField";
import MultiSelectField from "../MultiSelectField";
import { Option } from "../servicosOptions";
import { MultiValue, SingleValue } from "react-select";

interface SobreVoce {
  atendimentoA: string[];
  etnia: string;
  cabelo: string;
  estatura: string;
  corpo: string;
  seios: string;
  pubis: string;
  rol: string[]; // ✅ novo campo
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
  opcoesRol: Option[]; // ✅ nova prop
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
  opcoesRol, // ✅ novo
}) => {
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
        options={opcoesEtnia}
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
        options={opcoesEstatura}
        value={sobreVoce.estatura}
        onChange={makeSingleHandler("estatura")}
      />

      <SelectField
        label="Corpo"
        options={opcoesCorpo}
        value={sobreVoce.corpo}
        onChange={makeSingleHandler("corpo")}
      />

      <SelectField
        label="Seios"
        options={opcoesSeios}
        value={sobreVoce.seios}
        onChange={makeSingleHandler("seios")}
      />

      <SelectField
        label="Púbis"
        options={opcoesPubis}
        value={sobreVoce.pubis}
        onChange={makeSingleHandler("pubis")}
      />

      <MultiSelectField
        label="Rol"
        options={opcoesRol}
        values={sobreVoce.rol}
        onChange={makeMultiHandler("rol")}
      />
    </div>
  );
};

export default SobreVoceSection;
