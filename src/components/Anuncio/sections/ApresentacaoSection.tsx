import React from "react";
import InputField from "../InputField";

interface ApresentacaoProps {
  nomeApresentacao: string;
  setNomeApresentacao: (v: string) => void;
  idadeApresentacao: string;
  setIdadeApresentacao: (v: string) => void;
  pesoApresentacao: number | "";
  setPesoApresentacao: (v: number | "") => void;
  alturaApresentacao: number | "";
  setAlturaApresentacao: (v: number | "") => void;
  tituloApresentacao: string;
  setTituloApresentacao: (v: string) => void;
  textoApresentacao: string;
  setTextoApresentacao: (v: string) => void;
}

const ApresentacaoSection: React.FC<ApresentacaoProps> = ({
  nomeApresentacao,
  setNomeApresentacao,
  idadeApresentacao,
  setIdadeApresentacao,
  pesoApresentacao,
  setPesoApresentacao,
  alturaApresentacao,
  setAlturaApresentacao,
  tituloApresentacao,
  setTituloApresentacao,
  textoApresentacao,
  setTextoApresentacao,
}) => {
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
      <h3 className="modal__section-title">Apresentação</h3>
      {/* 5) Título (mínimo 40 caracteres) */}
      <label className="modal__label">
        Título Anuncio
        <input
          type="text"
          className="modal__input"
          value={nomeApresentacao}
          onChange={(e) => setNomeApresentacao(e.target.value)}
          placeholder="Digite ao menos 40 caracteres"
        />
      </label>

      {/* <InputField label="Nome" type="text" /> */}

      {/* 2) Idade */}
      <label className="modal__label">
        Idade
        <select
          className="modal__input"
          value={idadeApresentacao}
          onChange={(e) => setIdadeApresentacao(e.target.value)}
          required
        >
          <option value="">Selecione a sua idade</option>
          {Array.from({ length: 83 }, (_, i) => i + 18).map((ano) => (
            <option key={ano} value={ano.toString()}>
              {ano}
            </option>
          ))}
        </select>
      </label>

      {/* 3) Peso (kg) */}
      <InputField
        label="Peso (kg)"
        type="number"
        value={pesoApresentacao}
        onChange={(e) =>
          setPesoApresentacao(
            e.target.value === "" ? "" : parseFloat(e.target.value)
          )
        }
        min={0}
        step={0.1}
      />

      <InputField
        label="Altura (cm)"
        type="number"
        value={alturaApresentacao}
        onChange={(e) =>
          setAlturaApresentacao(
            e.target.value === "" ? "" : parseFloat(e.target.value)
          )
        }
        min={0}
        step={0.1}
      />

      {/* 6) Texto (mínimo 250 caracteres) */}
      <label className="modal__label">
        Texto
        <textarea
          className="modal__textarea"
          value={textoApresentacao}
          onChange={(e) => setTextoApresentacao(e.target.value)}
          placeholder="Digite um texto de apresentação (mínimo 250 caracteres)"
          rows={8}
        />
      </label>
    </div>
  );
};

export default ApresentacaoSection;
