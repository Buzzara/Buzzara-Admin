// src/components/Anuncio/sections/ServicosSection.tsx
import React from "react";
import MultiSelectField from "../MultiSelectField";
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
      {/* === Seção “Serviços” === */}
      <div
        className="modal__section"
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "4px",
        }}
      >
        <h3 className="modal__section-title">Serviços</h3>
        <MultiSelectField
          label=""
          options={opcoesServicos}
          values={valorServicos}
          onChange={(selected) =>
            setValorServicos(selected ? selected.map((o) => o.value) : [])
          }
          placeholder="Selecione os serviços"
        />
      </div>
      {/* ==== Fim “Serviços” ==== */}

      {/* === Seção “Serviços Especiais” === */}
      <div
        className="modal__section"
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "4px",
        }}
      >
        <h3 className="modal__section-title">Serviços especiais</h3>
        <MultiSelectField
          label=""
          options={opcoesServicosEspeciais}
          values={valorServicosEspeciais}
          onChange={(selected) =>
            setValorServicosEspeciais(
              selected ? selected.map((o) => o.value) : []
            )
          }
          placeholder="Selecione os serviços especiais"
        />
      </div>
      {/* ==== Fim “Serviços Especiais” ==== */}

      {/* === Seção “Lugar” === */}
      <div
        className="modal__section"
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "4px",
        }}
      >
        <h3 className="modal__section-title">Lugar</h3>
        <MultiSelectField
          label=""
          options={opcoesLugar}
          values={valorLugar}
          onChange={(selected) =>
            setValorLugar(selected ? selected.map((o) => o.value) : [])
          }
          placeholder="Selecione o lugar"
        />
      </div>
      {/* ==== Fim “Lugar” ==== */}
    </>
  );
};

export default ServicosSection;
