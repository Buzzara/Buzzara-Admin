import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { criarPerfilAcompanhante } from "../../services/acompanhante/criarPerfilAcompanhante";
import type {
  CriarPerfilParams,
  CriarPerfilResponse,
} from "../../types/perfilAcompanhante/useCriarPerfilAcompanhante";
import "./ModalObrigatorioPerfil.scss";

interface ModalObrigatorioPerfilProps {
  isOpen: boolean;
  onSave: (data: {
    descricao: string;
    cep: string;
    cidade: string;
  }) => Promise<void> | void;
}

interface ViaCepResponse {
  localidade?: string;
  erro?: boolean;
}

export const ModalObrigatorioPerfil: React.FC<ModalObrigatorioPerfilProps> = ({
  isOpen,
  onSave,
}) => {
  const [descricao, setDescricao] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [loadingCidade, setLoadingCidade] = useState(false);
  const [erroCep, setErroCep] = useState<string | null>(null);

  const [saving, setSaving] = useState<boolean>(false);
  const [errorSalvar, setErrorSalvar] = useState<string | null>(null);

  const { user, setPerfilAcompanhanteID } = useAuth();

  const buscarCidadePorCep = async (cepFormatado: string) => {
    setLoadingCidade(true);
    setErroCep(null);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepFormatado}/json/`
      );
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setCidade("");
        setErroCep("CEP não encontrado");
      } else {
        setCidade(data.localidade || "");
      }
    } catch {
      setErroCep("Erro ao buscar CEP");
      setCidade("");
    } finally {
      setLoadingCidade(false);
    }
  };

  const handleCepBlur = () => {
    const apenasDigitos = cep.replace(/\D/g, "");
    if (apenasDigitos.length === 8) {
      buscarCidadePorCep(apenasDigitos);
    } else {
      setErroCep("CEP deve ter 8 dígitos");
      setCidade("");
    }
  };

  const handleSave = async () => {
    setErrorSalvar(null);

    if (!descricao.trim()) {
      alert("Preencha a descrição do perfil.");
      return;
    }
    if (cep.replace(/\D/g, "").length !== 8 || !cidade) {
      alert("Informe um CEP válido para preencher a cidade.");
      return;
    }
    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    const payload: CriarPerfilParams = {
      perfilAcompanhanteID: 0,
      usuarioID: user.id,
      descricao,
      localizacao: cidade,
      tarifa: 0,
      telefone: "",
      estaOnline: true,
      ultimoAcesso: new Date().toISOString(),
      ultimoIP: "0.0.0.0",
    };

    try {
      setSaving(true);

      const response: CriarPerfilResponse = await criarPerfilAcompanhante(
        payload
      );

      const novoPerfilID = response.perfilId;
      setPerfilAcompanhanteID(novoPerfilID);

      await onSave({ descricao, cep, cidade });
    } catch (err) {
      console.error("[ModalObrigatorioPerfil] Erro ao criar perfil:", err);
      setErrorSalvar("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setDescricao("");
      setCep("");
      setCidade("");
      setErroCep(null);
      setErrorSalvar(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <header className="modal-header">
          <h2>Complete seu Perfil de Acompanhante</h2>
        </header>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="descricao">Descrição do Perfil</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite uma breve descrição sobre você..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="cep">CEP</label>
            <input
              type="text"
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur}
              placeholder="Digite seu CEP (somente números)"
              maxLength={9}
            />
            {erroCep && <span className="error-text">{erroCep}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cidade">Cidade</label>
            <input
              type="text"
              id="cidade"
              value={loadingCidade ? "Carregando..." : cidade}
              readOnly
              placeholder="A cidade será preenchida automaticamente"
            />
          </div>

          {errorSalvar && (
            <div className="error-text" style={{ marginTop: "0.5rem" }}>
              {errorSalvar}
            </div>
          )}
        </div>

        <footer className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </footer>
      </div>
    </div>
  );
};
