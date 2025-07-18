import React, { useState, useRef, useEffect } from "react";
import "../Anuncio/style/NewAnuncioModal.scss";
import { Estado } from "../../types/localizacao/useEstado";
import { criarAnuncio } from "../../services/anuncio/criarAnuncio";
import type {
  CriarAnuncioParams,
  CriarAnuncioResponse,
} from "../../types/anuncio/useCriarAnuncio";

import OndeAnunciarSection from "./sections/OndeAnunciarSection";
import ApresentacaoSection from "./sections/ApresentacaoSection";
import HorarioSection from "./sections/HorarioSection";
import ServicosSection from "./sections/ServicosSection";
import SobreVoceSection from "./sections/SobreVoceSection";
import CacheSection from "./sections/CacheSection";
import FotosVideoSection from "./sections/FotosVideoSection";
import TdPositivosSection from "./sections/TdPositivosSection";

import {
  opcoesAtendimentoA,
  opcoesEtnia,
  opcoesCabelo,
  opcoesEstatura,
  opcoesCorpo,
  opcoesSeios,
  opcoesPubis,
  opcoesPagamento,
  opcoesRol,
} from "./sobreVoceOptions";

import {
  opcoesServicos,
  opcoesServicosEspeciais,
  opcoesLugar,
} from "./servicosOptions";

interface MunicipioIBGE {
  nome: string;
}

interface NewAnuncioModalProps {
  isOpen: boolean;
  servicoID: number;
  onClose: () => void;
  onSuccess: (anuncio: CriarAnuncioResponse) => void;
}

const NewAnuncioModal: React.FC<NewAnuncioModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Estados principais
  const [tipoUsuario, setTipoUsuario] = useState<"Garota" | "Trans" | "Homem">(
    "Garota"
  );
  const todasCategorias = [
    "Acompanhantes",
    "Massagens eróticas",
    "Videochamadas e Sexting",
  ];
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>(
    ["Acompanhantes"]
  );

  // Localização e busca
  const [buscaLivre, setBuscaLivre] = useState("");
  const [area, setArea] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidadesPorEstado, setCidadesPorEstado] = useState<string[]>([]);
  const [saidasA, setSaidasA] = useState<string[]>([]);

  // Apresentação
  const [nomeApresentacao, setNomeApresentacao] = useState("");
  const [idadeApresentacao, setIdadeApresentacao] = useState<string>("");
  const [pesoApresentacao, setPesoApresentacao] = useState<number | "">("");
  const [alturaApresentacao, setAlturaApresentacao] = useState<number | "">(
    ""
  );
  const [tituloApresentacao, setTituloApresentacao] = useState("");
  const [textoApresentacao, setTextoApresentacao] = useState("");

  // Horário
  const [horario24h, setHorario24h] = useState(false);
  const [startHour, setStartHour] = useState("08");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("18");
  const [endMinute, setEndMinute] = useState("00");
  const [sameEveryDay, setSameEveryDay] = useState<"Sim" | "Não">("Sim");

  // Serviços
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [servicosEspeciaisSelecionados, setServicosEspeciaisSelecionados] =
    useState<string[]>([]);
  const [lugarSelecionado, setLugarSelecionado] = useState<string[]>([]);

  // Sobre você
  const [sobreVoce, setSobreVoce] = useState({
    atendimentoA: [] as string[],
    etnia: "",
    cabelo: "",
    estatura: "",
    corpo: "",
    seios: "",
    pubis: "",
    rol: [] as string[],
  });

  // Cachês
  const [linhasCache, setLinhasCache] = useState(
    Array.from({ length: 8 }).map((_, i) => ({
      descricao: i === 0 ? "1 hora" : "",
      valor: "",
      disabled: i === 0,
    }))
  );

  // Mídia
  const [fotos, setFotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // TD Positivos
  const [linkTD, setLinkTD] = useState<string>("");

  // Controle UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Busca lista de estados ao montar o componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const data = (await res.json()) as Estado[];
        setEstados(data.sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch (err: unknown) {
        console.error("❌ Erro ao buscar estados:", err);
      }
    };
    fetchEstados();
  }, []);

  // 2) Busca cidades sempre que o usuário mudar o estado
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
        const data = (await res.json()) as MunicipioIBGE[];
        setCidadesPorEstado(
          data.map((m) => m.nome).sort((a, b) => a.localeCompare(b))
        );
      } catch (err: unknown) {
        console.error("❌ Erro ao buscar cidades:", err);
        setCidadesPorEstado([]);
      }
    };
    fetchCidades();
  }, [estado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CriarAnuncioParams = {
        nome: nomeApresentacao,
        descricao: textoApresentacao,
        saidas: [...saidasA, area].filter(Boolean).join(", "),
        lugarEncontro: lugarSelecionado,
        servicoPrestado: servicosSelecionados.join(", "),
        servicoEspecial: servicosEspeciaisSelecionados.join(", "),
        idade: Number(idadeApresentacao),
        peso:
          typeof pesoApresentacao === "number" ? pesoApresentacao : 0,
        altura:
          typeof alturaApresentacao === "number" ? alturaApresentacao : 0,
        endereco: "",
        cidade,
        estado,
        bairro: "",
        latitude: 0,
        longitude: 0,
        fotos,
        video: video ?? undefined,
        sobreUsuario: {
          atendimento: sobreVoce.atendimentoA,
          etnia: sobreVoce.etnia,
          relacionamento: sobreVoce.rol.join(", "),
          cabelo: sobreVoce.cabelo,
          estatura: sobreVoce.estatura,
          corpo: sobreVoce.corpo,
          seios: sobreVoce.seios,
          pubis: sobreVoce.pubis,
        },
        caches: linhasCache
          .filter((lc) => lc.descricao && Number(lc.valor) > 0)
          .map((lc) => ({
            formaPagamento: lc.descricao,
            descricao: lc.descricao,
            valor: Number(lc.valor) || 0,
          })),
      };

      const novo = await criarAnuncio(payload);
      onSuccess(novo);
      onClose();
    } catch (err: unknown) {
      let mensagem = "Erro desconhecido";
      if (err instanceof Error) mensagem = err.message;
      setError(mensagem);
      console.error("❌ Erro ao criar anúncio:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title">Novo Anúncio</h2>
        {error && <div className="modal__error">{error}</div>}

        <form className="modal__form" onSubmit={handleSubmit}>
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

          <ApresentacaoSection
            nomeApresentacao={nomeApresentacao}
            setNomeApresentacao={setNomeApresentacao}
            idadeApresentacao={idadeApresentacao}
            setIdadeApresentacao={setIdadeApresentacao}
            pesoApresentacao={pesoApresentacao}
            setPesoApresentacao={setPesoApresentacao}
            alturaApresentacao={alturaApresentacao}
            setAlturaApresentacao={setAlturaApresentacao}
            tituloApresentacao={tituloApresentacao}
            setTituloApresentacao={setTituloApresentacao}
            textoApresentacao={textoApresentacao}
            setTextoApresentacao={setTextoApresentacao}
          />

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

          <SobreVoceSection
            sobreVoce={sobreVoce}
            setSobreVoce={setSobreVoce}
            opcoesAtendimentoA={opcoesAtendimentoA}
            opcoesEtnia={opcoesEtnia}
            opcoesCabelo={opcoesCabelo}
            opcoesRol={opcoesRol}
            opcoesEstatura={opcoesEstatura}
            opcoesCorpo={opcoesCorpo}
            opcoesSeios={opcoesSeios}
            opcoesPubis={opcoesPubis}
          />

          <CacheSection
            formasPagamento={opcoesPagamento.map((o) => o.value)}
            setFormasPagamento={() => {}}
            linhasCache={linhasCache}
            setLinhasCache={setLinhasCache}
            opcoesPagamento={opcoesPagamento}
          />

          <FotosVideoSection
            fotos={fotos}
            setFotos={setFotos}
            video={video}
            setVideo={setVideo}
            imageInputRef={imageInputRef}
            videoInputRef={videoInputRef}
            photoSlots={8}
          />

          <TdPositivosSection linkTD={linkTD} setLinkTD={setLinkTD} />

          <button type="submit" className="modal__submit" disabled={loading}>
            {loading ? "Enviando..." : "Criar Anúncio"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAnuncioModal;
