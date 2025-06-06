// src/components/Anuncio/sections/CacheSection.tsx
import React from "react";
import MultiSelectField from "../MultiSelectField";
import { Option } from "../servicosOptions";

interface CacheLinha {
  descricao: string;
  valor: string;
  disabled: boolean;
}

interface CacheSectionProps {
  formasPagamento: string[];
  setFormasPagamento: (arr: string[]) => void;
  linhasCache: CacheLinha[];
  setLinhasCache: React.Dispatch<React.SetStateAction<CacheLinha[]>>;
  opcoesPagamento: Option[];
}

const CacheSection: React.FC<CacheSectionProps> = ({
  formasPagamento,
  setFormasPagamento,
  linhasCache,
  setLinhasCache,
  opcoesPagamento,
}) => {
  const handleFormasPagamentoChange = (
    selected: React.MultiValue<{ value: string; label: string }>
  ) => {
    setFormasPagamento(selected ? selected.map((o) => o.value) : []);
  };

  const handleLinhaCacheChange = (
    idx: number,
    field: "descricao" | "valor",
    value: string
  ) => {
    setLinhasCache((prev) => {
      const novo = [...prev];
      novo[idx] = { ...novo[idx], [field]: value };
      return novo;
    });
  };

  return (
    <div className="modal__section">
      <h3 className="modal__section-title">R$ Cachês</h3>

      <MultiSelectField
        label="Formas de pagamento"
        options={opcoesPagamento}
        values={formasPagamento}
        onChange={handleFormasPagamentoChange}
        placeholder="Selecione formas de pagamento"
      />

      <div className="modal__subsection modal__grid-header">
        <span className="modal__grid-title">Descrição</span>
        <span className="modal__grid-title">Valor (R$)</span>
      </div>
      <div className="modal__grid">
        {linhasCache.map((linha, idx) => (
          <React.Fragment key={idx}>
            <input
              type="text"
              className="modal__input modal__input--descricao"
              placeholder="Descrição"
              value={linha.descricao}
              disabled={linha.disabled}
              onChange={(e) =>
                handleLinhaCacheChange(idx, "descricao", e.target.value)
              }
            />
            <input
              type="text"
              className="modal__input modal__input--valor"
              placeholder="R$ 0,00"
              value={linha.valor}
              onChange={(e) =>
                handleLinhaCacheChange(idx, "valor", e.target.value)
              }
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CacheSection;
