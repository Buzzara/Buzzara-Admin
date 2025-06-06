// src/components/Anuncio/NewAnuncioModal.tsx

import React, { useState, useRef, useEffect } from "react";
import "../Anuncio/style/NewAnuncioModal.scss";
import { Estado } from "../../types/localizacao/useEstado";

import { criarAnuncio } from "../../services/anuncio/criarAnuncio";
import { CriarAnuncioResponse, CriarAnuncioParams } from "../../types/anuncio/useCriarAnuncio";

import OndeAnunciarSection from "./sections/OndeAnunciarSection";
import ApresentacaoSection from "./sections/ApresentacaoSection";
import HorarioSection from "./sections/HorarioSection";
import ServicosSection from "./sections/ServicosSection";
import SobreVoceSection from "./sections/SobreVoceSection";
import CacheSection from "./sections/CacheSection";
import FotosVideoSection from "./sections/FotosVideoSection";
import TdPositivosSection from "./sections/TdPositivosSection";

import InputField from "./InputField";

import {
  opcoesAtendimentoA,
  opcoesEtnia,
  opcoesCabelo,
  opcoesEstatura,
  opcoesCorpo,
  opcoesSeios,
  opcoesPubis,
  opcoesPagamento,
} from "./sobreVoceOptions";

import {
  opcoesServicos,
  opcoesServicosEspeciais,
  opcoesLugar,
} from "./servicosOptions";

interface NewAnuncioModalProps {
  isOpen: boolean;
  servicoID: number;
  onClose: () => void;
  onSuccess: (anuncio: CriarAnuncioResponse) => void;
}

const NewAnuncioModal: React.FC<NewAnuncioModalProps> = ({
  isOpen,
  servicoID,
  onClose,
  onSuccess,
}) => {
  //
  // ─── 1) “Onde anunciar‐se” ──────────────────────────────────────────────
  //
  const [tipoUsuario, setTipoUsuario] = useState<"Garota" | "Trans" | "Homem">("Garota");
  const todasCategorias = ["Acompanhantes", "Massagens eróticas", "Videochamadas e Sexting"];
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>(["Acompanhantes"]);
  const [buscaLivre, setBuscaLivre] = useState("");
  const [area, setArea] = useState("");

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidadesPorEstado, setCidadesPorEstado] = useState<string[]>([]);
  const [saidasA, setSaidasA] = useState<string[]>([]);

  //
  // ─── 2) “Apresentação” ───────────────────────────────────────────────────
  //
  const [nomeApresentacao, setNomeApresentacao] = useState("");
  const [idadeApresentacao, setIdadeApresentacao] = useState<string>("");
  const [tituloApresentacao, setTituloApresentacao] = useState("");
  const [textoApresentacao, setTextoApresentacao] = useState("");

  //
  // ─── 3) “Horário” ───────────────────────────────────────────────────────
  //
  const [horario24h, setHorario24h] = useState(false);
  const [startHour, setStartHour] = useState("08");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("18");
  const [endMinute, setEndMinute] = useState("00");
  const [sameEveryDay, setSameEveryDay] = useState<"Sim" | "Não">("Sim");

  //
  // ─── 4) “Serviços / Serviços Especiais / Lugar” ─────────────────────────
  //
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [servicosEspeciaisSelecionados, setServicosEspeciaisSelecionados] = useState<string[]>([]);
  const [lugarSelecionado, setLugarSelecionado] = useState<string[]>([]);

  //
  // ─── 5) “Sobre você” ────────────────────────────────────────────────────
  //
  const [sobreVoce, setSobreVoce] = useState<{
    atendimentoA: string[];
    etnia: string;
    cabelo: string[];
    estatura: string[];
    corpo: string[];
    seios: string[];
    pubis: string[];
  }>({
    atendimentoA: [],
    etnia: "",
    cabelo: [],
    estatura: [],
    corpo: [],
    seios: [],
    pubis: [],
  });

  //
  // ─── 6) “R$ Cachês” e anexos ─────────────────────────────────────────────
  //
  const [formasPagamento, setFormasPagamento] = useState<string[]>([]);
  const [linhasCache, setLinhasCache] = useState<
    { descricao: string; valor: string; disabled: boolean }[]
  >(
    Array.from({ length: 8 }).map((_, i) => ({
      descricao: i === 0 ? "1 hora" : "",
      valor: "",
      disabled: i === 0,
    }))
  );

  const [fotos, setFotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const photoSlots = 8;

  //
  // ─── 7) “Campos principais do anúncio” ───────────────────────────────────
  //
  const [categoria, setCategoria] = useState("Acompanhante");
  const [lugarEncontro, setLugarEncontro] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [peso, setPeso] = useState<number | "">("");
  const [altura, setAltura] = useState<number | "">("");

  //
  // ─── 8) “TD positivos” (novo estado para linkTD) ─────────────────────────
  //
  const [linkTD, setLinkTD] = useState<string>("");

  //
  // ─── 9) Loading / Erro ────────────────────────────────────────────────────
  //
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //
  // ─── 10) Busca de Estados / Cidades (IBGE) ─────────────────────────────────
  //
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const url = import.meta.env.VITE_API_IBGE_ESTADOS!;
        const res = await fetch(url);
        const data: Estado[] = await res.json();
        setEstados(data.sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch (err) {
        console.error("❌ Erro ao buscar estados:", err);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (!estado) {
      setCidadesPorEstado([]);
      return;
    }
    const fetchCidades = async () => {
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
        );
        const data = await res.json();
        const nomes: string[] = data.map((obj: any) => obj.nome);
        setCidadesPorEstado(nomes.sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.error("❌ Erro ao buscar cidades:", err);
        setCidadesPorEstado([]);
      }
    };
    fetchCidades();
  }, [estado]);

  //
  // ─── 11) REFs para anexos ──────────────────────────────────────────────────
  //
  // (a tipagem “<HTMLInputElement>” basta, sem “| null” no genérico)
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  //
  // ─── 12) FUNÇÃO handleSubmit (chama `criarAnuncio`) ───────────────────────
  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      /************************************************************************
       *  Monta um objeto “CriarAnuncioParams” com todos os campos.         *
       *  A função `criarAnuncio` vai converter em FormData e fazer POST.   *
       ************************************************************************/
      const payload: CriarAnuncioParams = {
        servicoID,

        // 1) Onde anunciar-se
        tipoUsuario,
        categoriasOndeAnunciar: categoriasSelecionadas,
        buscaLivre,
        estado,
        cidade,
        area,
        saidasA,

        // 2) Apresentação
        nomeApresentacao,
        idadeApresentacao,
        tituloApresentacao,
        textoApresentacao,

        // 3) Horário
        horario24h,
        startHour: horario24h ? undefined : startHour,
        startMinute: horario24h ? undefined : startMinute,
        endHour: horario24h ? undefined : endHour,
        endMinute: horario24h ? undefined : endMinute,
        sameEveryDay,

        // 4) Serviços / Serviços Especiais / Lugar
        servicos: servicosSelecionados,
        servicosEspeciais: servicosEspeciaisSelecionados,
        lugar: lugarSelecionado,

        // 5) Campos principais do anúncio
        categoria,
        lugarEncontro,
        idade: idade === "" ? undefined : Number(idade),
        peso: peso === "" ? undefined : Number(peso),
        altura: altura === "" ? undefined : Number(altura),
        dataCriacao: new Date().toISOString(),

        // 6) Sobre você
        atendimentoA: sobreVoce.atendimentoA,
        etnia: sobreVoce.etnia,
        cabelo: sobreVoce.cabelo,
        estatura: sobreVoce.estatura,
        corpo: sobreVoce.corpo,
        seios: sobreVoce.seios,
        pubis: sobreVoce.pubis,

        // 7) R$ Cachês
        formasPagamento,
        linhasCache: linhasCache.map((lc) => ({
          descricao: lc.descricao,
          valor: lc.valor,
        })),

        // 8) Fotos e Vídeo (arrays de File / File)
        fotos,
        video: video ?? undefined,

        // 9) TD positivos
        linkTD,
      };

      // → chama a função unificada de criação de anúncio
      const novoAnuncio = await criarAnuncio(payload);
      onSuccess(novoAnuncio);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      console.error("Erro ao criar anúncio:", err);
    } finally {
      setLoading(false);
    }
  };

  //
  // ─── 13) Se não estiver aberto, retorna nulo ──────────────────────────────
  //
  if (!isOpen) {
    return null;
  }

  //
  // ─── 14) Renderiza todo o modal ────────────────────────────────────────────
  //
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title">Novo Anúncio</h2>
        {error && <div className="modal__error">{error}</div>}

        <div className="modal__body">
          <form className="modal__form" onSubmit={handleSubmit}>
            {/* ========== SEÇÃO “Onde anunciar‐se” ========== */}
            <OndeAnunciarSection
              tipoUsuario={tipoUsuario}
              setTipoUsuario={setTipoUsuario}
              todasCategorias={todasCategorias}
              categoriasSelecionadas={categoriasSelecionadas}
              setCategoriasSelecionadas={setCategoriasSelecionadas}
              buscaLivre={buscaLivre}
              setBuscaLivre={setBuscaLivre}
              area={area}
              setArea={setArea}
              estado={estado}
              setEstado={setEstado}
              cidade={cidade}
              setCidade={setCidade}
              estadosLista={estados}
              cidadesPorEstado={cidadesPorEstado}
              setCidadesPorEstado={setCidadesPorEstado}
              saidasA={saidasA}
              setSaidasA={setSaidasA}
            />

            {/* ========== SEÇÃO “Apresentação” ========== */}
            <ApresentacaoSection
              nomeApresentacao={nomeApresentacao}
              setNomeApresentacao={setNomeApresentacao}
              idadeApresentacao={idadeApresentacao}
              setIdadeApresentacao={setIdadeApresentacao}
              tituloApresentacao={tituloApresentacao}
              setTituloApresentacao={setTituloApresentacao}
              textoApresentacao={textoApresentacao}
              setTextoApresentacao={setTextoApresentacao}
            />

            {/* ========== SEÇÃO “Horário” ========== */}
            <HorarioSection
              horario24h={horario24h}
              setHorario24h={setHorario24h}
              startHour={startHour}
              setStartHour={setStartHour}
              startMinute={startMinute}
              setStartMinute={setStartMinute}
              endHour={endHour}
              setEndHour={setEndHour}
              endMinute={endMinute}
              setEndMinute={setEndMinute}
              sameEveryDay={sameEveryDay}
              setSameEveryDay={setSameEveryDay}
            />

            {/* ========== SEÇÃO “Serviços / Serviços Especiais / Lugar” ========== */}
            <ServicosSection
              valorServicos={servicosSelecionados}
              setValorServicos={setServicosSelecionados}
              valorServicosEspeciais={servicosEspeciaisSelecionados}
              setValorServicosEspeciais={setServicosEspeciaisSelecionados}
              valorLugar={lugarSelecionado}
              setValorLugar={setLugarSelecionado}
              opcoesServicos={opcoesServicos}
              opcoesServicosEspeciais={opcoesServicosEspeciais}
              opcoesLugar={opcoesLugar}
            />

            {/* ========== SEÇÃO “Sobre você” ========== */}
            <SobreVoceSection
              sobreVoce={sobreVoce}
              setSobreVoce={setSobreVoce}
              opcoesAtendimentoA={opcoesAtendimentoA}
              opcoesEtnia={opcoesEtnia}
              opcoesCabelo={opcoesCabelo}
              opcoesEstatura={opcoesEstatura}
              opcoesCorpo={opcoesCorpo}
              opcoesSeios={opcoesSeios}
              opcoesPubis={opcoesPubis}
            />

            {/* ========== SEÇÃO “R$ Cachês” ========== */}
            <CacheSection
              formasPagamento={formasPagamento}
              setFormasPagamento={setFormasPagamento}
              linhasCache={linhasCache}
              setLinhasCache={setLinhasCache}
              opcoesPagamento={opcoesPagamento}
            />


            {/* ========== SEÇÃO “Fotos e Vídeo” ========== */}
            <FotosVideoSection
              fotos={fotos}
              setFotos={setFotos}
              video={video}
              setVideo={setVideo}
              imageInputRef={imageInputRef}
              videoInputRef={videoInputRef}
              photoSlots={photoSlots}
            />

            {/* ========== SEÇÃO “TD Positivos” ========== */}
            <TdPositivosSection
              linkTD={linkTD}
              setLinkTD={setLinkTD}
            />

            <button
              type="submit"
              className="modal__submit"
              disabled={loading || (fotos.length === 0 && !video)}
            >
              {loading ? "Enviando..." : "Criar Anúncio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAnuncioModal;
