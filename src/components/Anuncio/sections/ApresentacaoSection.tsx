import React from "react";
import InputField from "../InputField";

interface ApresentacaoProps {
  nomeApresentacao: string;
  setNomeApresentacao: (v: string) => void;
  idadeApresentacao: string;
  setIdadeApresentacao: (v: string) => void;
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
  tituloApresentacao,
  setTituloApresentacao,
  textoApresentacao,
  setTextoApresentacao,
}) => {
  const tituloCount = tituloApresentacao.length;
  const textoCount = textoApresentacao.length;

  return (
    <div className="modal__section">
      <h3 className="modal__section-title">Apresentação</h3>

      <InputField
        label="Nome"
        type="text"
        value={nomeApresentacao}
        onChange={(e) => setNomeApresentacao(e.target.value)}
        required
      />

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

      <label className="modal__label">
        Título
        <input
          type="text"
          className="modal__input"
          value={tituloApresentacao}
          onChange={(e) => setTituloApresentacao(e.target.value)}
          placeholder="Digite ao menos 40 caracteres"
          required
        />
      </label>
      <div style={{ marginTop: "-8px", marginBottom: "12px" }}>
        <small style={{ color: "red" }}>
          Você já escreveu {tituloCount} caracteres. O mínimo são 40.
        </small>
      </div>

      <label className="modal__label">
        Texto
        <textarea
          className="modal__textarea"
          value={textoApresentacao}
          onChange={(e) => setTextoApresentacao(e.target.value)}
          placeholder="Digite um texto de apresentação (mínimo 250 caracteres)"
          rows={8}
          required
        />
      </label>
      <div style={{ marginTop: "-8px", marginBottom: "24px" }}>
        <small style={{ color: "red" }}>
          Você já escreveu {textoCount} caracteres. O mínimo são 250.
        </small>
      </div>
    </div>
  );
};

export default ApresentacaoSection;
