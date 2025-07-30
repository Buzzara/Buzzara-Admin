import api from "../api";
import type {
  EditarAnuncioParams,
  EditarAnuncioResponse,
} from "../../types/anuncio/useEditarAnuncio";

/**
 * Constrói o FormData para enviar ao endpoint PUT /anuncios/{id}
 */
export function buildEditAnuncioFormData(data: EditarAnuncioParams): FormData {
  const form = new FormData();

  // 1) Campos simples com proteção contra undefined ou NaN
  const simples: Record<string, string> = {
    Nome: data.nome ?? "",
    Descricao: data.descricao ?? "",
    Saidas: data.saidas ?? "",
    LugarEncontro: Array.isArray(data.lugarEncontro)
      ? data.lugarEncontro.join(", ")
      : "",
    ServicoPrestado: data.servicoPrestado ?? "",
    ServicoEspecial: data.servicoEspecial ?? "",
    Idade: !isNaN(Number(data.idade)) ? String(data.idade) : "",
    Peso: !isNaN(Number(data.peso)) ? String(data.peso) : "",
    Altura: !isNaN(Number(data.altura)) ? String(data.altura) : "",
    Endereco: data.endereco ?? "",
    Cidade: data.cidade ?? "",
    Estado: data.estado ?? "",
    Bairro: data.bairro ?? "",
    Latitude: !isNaN(Number(data.latitude)) ? String(data.latitude) : "",
    Longitude: !isNaN(Number(data.longitude)) ? String(data.longitude) : "",
    MesmoHorarioTodosOsDias: String(data.mesmoHorarioTodosOsDias ?? false),
  };

  for (const [key, val] of Object.entries(simples)) {
    form.append(key, val);
  }

  // 2) SobreUsuario
  if (data.sobreUsuario) {
    if (Array.isArray(data.sobreUsuario.atendimento)) {
      data.sobreUsuario.atendimento.forEach((a) => {
        if (a) form.append("SobreUsuario.Atendimento", a);
      });
    }
    form.append("SobreUsuario.Etnia", data.sobreUsuario.etnia ?? "");
    form.append("SobreUsuario.Relacionamento", data.sobreUsuario.relacionamento ?? "");
    form.append("SobreUsuario.Cabelo", data.sobreUsuario.cabelo ?? "");
    form.append("SobreUsuario.Estatura", data.sobreUsuario.estatura ?? "");
    form.append("SobreUsuario.Corpo", data.sobreUsuario.corpo ?? "");
    form.append("SobreUsuario.Seios", data.sobreUsuario.seios ?? "");
    form.append("SobreUsuario.Pubis", data.sobreUsuario.pubis ?? "");
  }

  // 3) Caches
  if (Array.isArray(data.caches)) {
    data.caches
      .filter((c) => c.descricao && c.valor > 0)
      .forEach((cache, i) => {
        form.append(`Caches[${i}].FormaPagamento`, cache.formaPagamento ?? "");
        form.append(`Caches[${i}].Descricao`, cache.descricao ?? "");
        form.append(`Caches[${i}].Valor`, String(cache.valor));
      });
  }

  // 4) Fotos
  if (Array.isArray(data.fotos) && data.fotos.length > 0) {
    data.fotos.forEach((file) => {
      if (file) form.append("Fotos", file, file.name);
    });
  }

  // 5) Vídeo (opcional)
  if (data.video) {
    form.append("Video", data.video, data.video.name);
  }

  // 6) Horários de Atendimento
  if (data.mesmoHorarioTodosOsDias && data.horarioUnico) {
    form.append("HorarioUnico.DiaSemana", data.horarioUnico.diaSemana ?? "");
    form.append("HorarioUnico.Atende", String(data.horarioUnico.atende ?? false));
    form.append("HorarioUnico.HorarioInicio", data.horarioUnico.horarioInicio ?? "");
    form.append("HorarioUnico.HorarioFim", data.horarioUnico.horarioFim ?? "");
    form.append(
      "HorarioUnico.VinteQuatroHoras",
      String(data.horarioUnico.vinteQuatroHoras ?? false)
    );
  } else if (Array.isArray(data.horariosIndividuais)) {
    data.horariosIndividuais.forEach((h, i) => {
      form.append(`HorariosIndividuais[${i}].DiaSemana`, h.diaSemana ?? "");
      form.append(`HorariosIndividuais[${i}].Atende`, String(h.atende ?? false));
      form.append(`HorariosIndividuais[${i}].HorarioInicio`, h.horarioInicio ?? "");
      form.append(`HorariosIndividuais[${i}].HorarioFim`, h.horarioFim ?? "");
      form.append(`HorariosIndividuais[${i}].VinteQuatroHoras`, String(h.vinteQuatroHoras ?? false));
    });
  }

  return form;
}

/**
 * Chama a API em PUT /anuncios/{id}
 */
export async function editarAnuncio(
  servicoId: number,
  data: EditarAnuncioParams
): Promise<EditarAnuncioResponse> {
  const formData = buildEditAnuncioFormData(data);

  // Log de todas as entradas do FormData (útil para debug)
  console.log("📤 FormData entries before sending for update:");
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (value instanceof File) {
      console.log(`  ${key}: File(${value.name})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  });

  console.log(`🌐 Enviando PUT /anuncios/${servicoId} com FormData`);

  const response = await api.put<EditarAnuncioResponse>(
    `/anuncios/${servicoId}`,
    formData
  );

  console.log("✅ Resposta editarAnuncio:", response.data);

  return response.data;
}
