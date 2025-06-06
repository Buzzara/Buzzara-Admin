// src/components/Anuncio/sections/SobreVoceSection.tsx
import React from "react";
import SelectField from "../SelectField";
import { Option } from "../servicosOptions";
import MultiSelectField from "../MultiSelectField";

interface SobreVoceProps {
  sobreVoce: {
    atendimentoA: string[];
    etnia: string;
    cabelo: string[];
    estatura: string[];
    corpo: string[];
    seios: string[];
    pubis: string[];
  };
  setSobreVoce: React.Dispatch<
    React.SetStateAction<{
      atendimentoA: string[];
      etnia: string;
      cabelo: string[];
      estatura: string[];
      corpo: string[];
      seios: string[];
      pubis: string[];
    }>
  >;
  opcoesAtendimentoA: Option[];
  opcoesEtnia: Option[];
  opcoesCabelo: Option[];
  opcoesEstatura: Option[];
  opcoesCorpo: Option[];
  opcoesSeios: Option[];
  opcoesPubis: Option[];
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
}) => {
  // Fabrica um handler para multi-select (array de strings)
  const makeMultiHandler =
    (key: keyof typeof sobreVoce) =>
    (selected: React.MultiValue<{ value: string; label: string }>) => {
      setSobreVoce((prev) => ({
        ...prev,
        [key]: selected ? selected.map((o) => o.value) : [],
      }));
    };

  // Fabrica um handler para single-select (string)
  const makeSingleHandler =
    (key: keyof typeof sobreVoce) =>
    (selected: React.SingleValue<{ value: string; label: string }>) => {
      setSobreVoce((prev) => ({
        ...prev,
        [key]: selected ? selected.value : "",
      }));
    };

  return (
    <div className="modal__section">
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

      <MultiSelectField
        label="Cabelo"
        options={opcoesCabelo}
        values={sobreVoce.cabelo}
        onChange={makeMultiHandler("cabelo")}
      />

      <MultiSelectField
        label="Estatura"
        options={opcoesEstatura}
        values={sobreVoce.estatura}
        onChange={makeMultiHandler("estatura")}
      />

      <MultiSelectField
        label="Corpo"
        options={opcoesCorpo}
        values={sobreVoce.corpo}
        onChange={makeMultiHandler("corpo")}
      />

      <MultiSelectField
        label="Seios"
        options={opcoesSeios}
        values={sobreVoce.seios}
        onChange={makeMultiHandler("seios")}
      />

      <MultiSelectField
        label="Púbis"
        options={opcoesPubis}
        values={sobreVoce.pubis}
        onChange={makeMultiHandler("pubis")}
      />
    </div>
  );
};

export default SobreVoceSection;
