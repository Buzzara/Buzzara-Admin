import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { AnuncioResponse } from "../../services/anuncio/userAnuncio";
import "../Anuncio/style/NewAnuncioModal.scss";
import { Estado } from "../../types/localizacao/useEstado";

import OndeAnunciarSection from "./sections/OndeAnunciarSection";
import ApresentacaoSection from "./sections/ApresentacaoSection";
import HorarioSection from "./sections/HorarioSection";
import ServicosSection from "./sections/ServicosSection";
import SobreVoceSection from "./sections/SobreVoceSection";
import CacheSection from "./sections/CacheSection";
import FotosVideoSection from "./sections/FotosVideoSection";
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
  onSuccess: (anuncio: AnuncioResponse) => void;
}

interface CacheLinha {
  descricao: string;
  valor: string;
  disabled: boolean;
}

const NewAnuncioModal: React.FC<NewAnuncioModalProps> = ({
  isOpen,
  servicoID,
  onClose,
  onSuccess,
}) => {
  const [tipoUsuario, setTipoUsuario] = useState<"Garota" | "Trans" | "Homem">(
    "Garota"
  );
  const todasCategorias = [
    "Acompanhantes",
    "Massagens eróticas",
    "Videochamadas e Sexting",
  ];
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >(["Acompanhantes"]);
  const [buscaLivre, setBuscaLivre] = useState("");
  const [area, setArea] = useState("");

  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidadesPorEstado, setCidadesPorEstado] = useState<string[]>([]);
  const [saidasA, setSaidasA] = useState<string[]>([]);

  const [nomeApresentacao, setNomeApresentacao] = useState("");
  const [idadeApresentacao, setIdadeApresentacao] = useState<string>("");
  const [tituloApresentacao, setTituloApresentacao] = useState("");
  const [textoApresentacao, setTextoApresentacao] = useState("");

  const [horario24h, setHorario24h] = useState(false);
  const [startHour, setStartHour] = useState("08");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("18");
  const [endMinute, setEndMinute] = useState("00");
  const [sameEveryDay, setSameEveryDay] = useState<"Sim" | "Não">("Sim");

  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>(
    []
  );
  const [servicosEspeciaisSelecionados, setServicosEspeciaisSelecionados] =
    useState<string[]>([]);
  const [lugarSelecionado, setLugarSelecionado] = useState<string[]>([]);

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

  const [formasPagamento, setFormasPagamento] = useState<string[]>([]);
  const [linhasCache, setLinhasCache] = useState<CacheLinha[]>(
    Array.from({ length: 8 }).map((_, i) => ({
      descricao: i === 0 ? "1 hora" : "",
      valor: "",
      disabled: i === 0,
    }))
  );

  const [fotos, setFotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const photoSlots = 8;

  const [categoria, setCategoria] = useState("Acompanhante");
  const [lugarEncontro, setLugarEncontro] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [peso, setPeso] = useState<number | "">("");
  const [altura, setAltura] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("servicoID", String(servicoID));
      form.append("tipoUsuario", tipoUsuario);
      form.append(
        "categoriasOndeAnunciar",
        JSON.stringify(categoriasSelecionadas)
      );
      form.append("buscaLivre", buscaLivre);
      form.append("estado", estado);
      form.append("cidade", cidade);
      form.append("area", area);
      form.append("saidasA", JSON.stringify(saidasA));

      form.append("nomeApresentacao", nomeApresentacao);
      form.append("idadeApresentacao", idadeApresentacao);
      form.append("tituloApresentacao", tituloApresentacao);
      form.append("textoApresentacao", textoApresentacao);

      form.append("horario24h", horario24h ? "true" : "false");
      if (!horario24h) {
        form.append("startTime", `${startHour}:${startMinute}`);
        form.append("endTime", `${endHour}:${endMinute}`);
      }
      form.append("sameEveryDay", sameEveryDay);

      form.append("servicos", JSON.stringify(servicosSelecionados));
      form.append(
        "servicosEspeciais",
        JSON.stringify(servicosEspeciaisSelecionados)
      );
      form.append("lugar", JSON.stringify(lugarSelecionado));

      form.append("categoria", categoria);
      form.append("lugarEncontro", lugarEncontro);
      if (idade !== "") form.append("idade", String(idade));
      if (peso !== "") form.append("peso", String(peso));
      if (altura !== "") form.append("altura", String(altura));
      form.append("dataCriacao", new Date().toISOString());

      form.append("atendimentoA", JSON.stringify(sobreVoce.atendimentoA));
      form.append("etnia", sobreVoce.etnia);
      form.append("cabelo", JSON.stringify(sobreVoce.cabelo));
      form.append("estatura", JSON.stringify(sobreVoce.estatura));
      form.append("corpo", JSON.stringify(sobreVoce.corpo));
      form.append("seios", JSON.stringify(sobreVoce.seios));
      form.append("pubis", JSON.stringify(sobreVoce.pubis));

      form.append(
        "cacheData",
        JSON.stringify({
          formasPagamento,
          linhas: linhasCache.map(({ descricao, valor }) => ({
            descricao,
            valor,
          })),
        })
      );

      fotos.forEach((file) => form.append("Fotos", file));
      if (video) form.append("Video", video);

      const { data: anuncio } = await api.post<AnuncioResponse>(
        "/anuncios",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onSuccess(anuncio);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      console.error("Erro ao criar anúncio:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

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
              opcoesEstatura={opcoesEstatura}
              opcoesCorpo={opcoesCorpo}
              opcoesSeios={opcoesSeios}
              opcoesPubis={opcoesPubis}
            />

            <CacheSection
              formasPagamento={formasPagamento}
              setFormasPagamento={setFormasPagamento}
              linhasCache={linhasCache}
              setLinhasCache={setLinhasCache}
              opcoesPagamento={opcoesPagamento}
            />

            <InputField
              label="Categoria"
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />

            <InputField
              label="Lugar de Encontro"
              type="text"
              value={lugarEncontro}
              onChange={(e) => setLugarEncontro(e.target.value)}
              required
            />

            <InputField
              label="Idade"
              type="number"
              value={idade}
              onChange={(e) =>
                setIdade(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              required
              min={18}
            />

            <InputField
              label="Peso (kg)"
              type="number"
              value={peso}
              onChange={(e) =>
                setPeso(e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              min={0}
              step={0.1}
            />

            <InputField
              label="Altura (cm)"
              type="number"
              value={altura}
              onChange={(e) =>
                setAltura(
                  e.target.value === "" ? "" : parseFloat(e.target.value)
                )
              }
              min={0}
              step={0.1}
            />

            <FotosVideoSection
              fotos={fotos}
              setFotos={setFotos}
              video={video}
              setVideo={setVideo}
              imageInputRef={imageInputRef}
              videoInputRef={videoInputRef}
              photoSlots={photoSlots}
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
