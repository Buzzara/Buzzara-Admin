// src/components/ModalObrigatorioPerfil.tsx

import React, { useState, useEffect } from "react";
import "./ModalObrigatorioPerfil.scss";
import { useAuth } from "../../context/AuthContext";
import { createPerfil } from "../../services/profile/acompanhante/criarPerfilAcompanhante";
import type { CreatePerfilRequest } from "../../types/useCriarPerfilAcompanhante";

interface ModalObrigatorioPerfilProps {
  isOpen: boolean;
  onSave: (data: { descricao: string; cep: string; cidade: string }) => void;
}

// Tipagem simplificada para a resposta do ViaCEP
interface ViaCepResponse {
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export const ModalObrigatorioPerfil: React.FC<ModalObrigatorioPerfilProps> = ({
  isOpen,
  onSave,
}) => {
  // 1) campos do formulário
  const [descricao, setDescricao] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [loadingCidade, setLoadingCidade] = useState(false);
  const [erroCep, setErroCep] = useState<string | null>(null);

  // 2) estado de loading/falha para o POST /perfis
  const [saving, setSaving] = useState<boolean>(false);
  const [errorSalvar, setErrorSalvar] = useState<string | null>(null);

  // 3) do contexto, extraímos `user` e `setPerfilAcompanhanteID`
  const { user, setPerfilAcompanhanteID } = useAuth();

  // 4) busca a cidade a partir do CEP usando ViaCEP
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

  // 5) quando o usuário sai do campo CEP ou digita 8 dígitos
  const handleCepBlur = () => {
    const apenasDigitos = cep.replace(/\D/g, "");
    if (apenasDigitos.length === 8) {
      buscarCidadePorCep(apenasDigitos);
    } else {
      setErroCep("CEP deve ter 8 dígitos");
      setCidade("");
    }
  };

  // 6) ao clicar em “Salvar” no modal, efetua o POST /perfis
  const handleSave = async () => {
    setErrorSalvar(null);

    // Validações básicas
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

    // Monta o payload completo:
    const payload: CreatePerfilRequest = {
      perfilAcompanhanteID: 0, // 0 → novo perfil
      usuarioID: user.id,      // ID do usuário logado
      descricao,
      localizacao: cidade,     // cidade já preenchida pelo CEP
      tarifa: 0,
      telefone: "",
      estaOnline: true,
      ultimoAcesso: new Date().toISOString(),
      ultimoIP: "0.0.0.0",
    };

    console.log(
      "[ModalObrigatorioPerfil] Payload a ser enviado:",
      payload
    );

    try {
      setSaving(true);
      const response = await createPerfil(payload);

      console.log(
        "[ModalObrigatorioPerfil] Resposta createPerfil:",
        response
      );

      // injeta, no contexto, o novo perfilAcompanhanteID:
      const novoPerfilID = response.perfilId;
      setPerfilAcompanhanteID(novoPerfilID);

      // avisa o pai (Dashboard) que o perfil foi salvo:
      onSave({ descricao, cep, cidade });
    } catch (err) {
      console.error(
        "[ModalObrigatorioPerfil] Erro ao salvar perfil:",
        err
      );
      setErrorSalvar("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  // 7) limpa campos quando o modal reabre
  useEffect(() => {
    if (isOpen) {
      setDescricao("");
      setCep("");
      setCidade("");
      setErroCep(null);
      setErrorSalvar(null);
    }
  }, [isOpen]);

  // 8) se `isOpen === false`, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <header className="modal-header">
          <h2>Complete seu Perfil</h2>
          {/* sem botão de fechar, só “Salvar” mesmo */}
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
            {erroCep && (
              <span className="error-text">{erroCep}</span>
            )}
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
            <div
              className="error-text"
              style={{ marginTop: "0.5rem" }}
            >
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
