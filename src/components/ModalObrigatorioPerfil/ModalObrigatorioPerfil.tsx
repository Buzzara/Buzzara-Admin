// src/components/ModalObrigatorioPerfil.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createPerfil } from "../../services/profile/acompanhante/criarPerfilAcompanhante";
import type {
  CreatePerfilRequest,
  CreatePerfilResponse,
} from "../../types/useCriarPerfilAcompanhante";

interface ModalObrigatorioPerfilProps {
  isOpen: boolean;
  /**
   * Ao salvar, o modal chamará onSave({ descricao, cep, cidade }).
   * O componente pai deve receber esses três campos e, tipicamente,
   * enviar ao backend via PUT/POST. Pode retornar Promise<void> ou void.
   */
  onSave: (data: { descricao: string; cep: string; cidade: string }) => Promise<void> | void;
}

interface ViaCepResponse {
  localidade?: string;
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

  // 2) estado de saving / possível erro no POST
  const [saving, setSaving] = useState<boolean>(false);
  const [errorSalvar, setErrorSalvar] = useState<string | null>(null);

  // 3) Contexto de autenticação (precisamos do user e da função para atualizar perfilAcompanhanteID)
  const { user, setPerfilAcompanhanteID } = useAuth();

  // 4) Busca cidade com ViaCEP
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

  // 5) Quando o campo CEP perde o foco (ou usuário digitou 8 dígitos)
  const handleCepBlur = () => {
    const apenasDigitos = cep.replace(/\D/g, "");
    if (apenasDigitos.length === 8) {
      buscarCidadePorCep(apenasDigitos);
    } else {
      setErroCep("CEP deve ter 8 dígitos");
      setCidade("");
    }
  };

  // 6) Quando o usuário clica em “Salvar” no modal:
  const handleSave = async () => {
    setErrorSalvar(null);

    // Validações mínimas
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

    // Monta o payload para o backend
    const payload: CreatePerfilRequest = {
      perfilAcompanhanteID: 0, // 0 para novo perfil
      usuarioID: user.id,      // ID do usuário logado
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

      // Chama o serviço que faz POST /perfis
      const response: CreatePerfilResponse = await createPerfil(payload);

      // Se der certo, o backend retorna { message: "...", perfilId: <novoID> }
      const novoPerfilID = response.perfilId;
      // Armazena esse novo ID no contexto
      setPerfilAcompanhanteID(novoPerfilID);

      // Agora notificamos o componente pai, passando { descricao, cep, cidade }
      await onSave({ descricao, cep, cidade });
    } catch (err) {
      console.error("[ModalObrigatorioPerfil] Erro ao criar perfil:", err);
      setErrorSalvar("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  // 7) Limpa os campos sempre que o modal reabrir
  useEffect(() => {
    if (isOpen) {
      setDescricao("");
      setCep("");
      setCidade("");
      setErroCep(null);
      setErrorSalvar(null);
    }
  }, [isOpen]);

  // 8) Se o modal não estiver aberto, nada é renderizado
  if (!isOpen) {
    return null;
  }

  // 9) A renderização do modal propriamente dita
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
