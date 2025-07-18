// src/components/Anuncio/sections/ServicosSection.tsx

import React from "react";
import MultiSelectField, { MultiSelectFieldOption } from "../MultiSelectField";
import { MultiValue } from "react-select";
import { Option } from "../servicosOptions";

interface ServicosProps {
  valorServicos: string[];
  setValorServicos: (arr: string[]) => void;
  valorServicosEspeciais: string[];
  setValorServicosEspeciais: (arr: string[]) => void;
  valorLugar: string[];
  setValorLugar: (arr: string[]) => void;
  opcoesServicos: Option[];
  opcoesServicosEspeciais: Option[];
  opcoesLugar: Option[];
}

const ServicosSection: React.FC<ServicosProps> = ({
  valorServicos,
  setValorServicos,
  valorServicosEspeciais,
  setValorServicosEspeciais,
  valorLugar,
  setValorLugar,
  opcoesServicos,
  opcoesServicosEspeciais,
  opcoesLugar,
}) => {
  return (
    <>
      {/* Serviços */}
      <div className="modal__section" style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}>
        <h3 className="modal__section-title">Serviços</h3>
        <MultiSelectField
          label=""
          options={opcoesServicos}
          values={valorServicos}
          onChange={(selected: MultiValue<MultiSelectFieldOption>) => {
            setValorServicos(selected.map(o => o.value));
          }}
          placeholder="Selecione os serviços"
        />
      </div>

      {/* Serviços Especiais */}
      <div className="modal__section" style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}>
        <h3 className="modal__section-title">Serviços Especiais</h3>
        <MultiSelectField
          label=""
          options={opcoesServicosEspeciais}
          values={valorServicosEspeciais}
          onChange={(selected: MultiValue<MultiSelectFieldOption>) => {
            setValorServicosEspeciais(selected.map(o => o.value));
          }}
          placeholder="Selecione os serviços especiais"
        />
      </div>

      {/* Lugar de Encontro */}
      <div className="modal__section" style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "24px",
        borderRadius: "4px",
      }}>
        <h3 className="modal__section-title">Lugar de Encontro</h3>
        <MultiSelectField
          label=""
          options={opcoesLugar}
          values={valorLugar}
          onChange={(selected: MultiValue<MultiSelectFieldOption>) => {
            setValorLugar(selected.map(o => o.value));
          }}
          placeholder="Selecione o lugar de encontro"
        />
      </div>
    </>
  );
};

export default ServicosSection;
