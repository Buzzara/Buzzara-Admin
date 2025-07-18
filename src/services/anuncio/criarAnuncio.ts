// src/services/anuncio/criarAnuncio.ts
import api from "../api";
import type {
  CriarAnuncioParams,
  CriarAnuncioResponse,
} from "../../types/anuncio/useCriarAnuncio";

/**
 * Constrói o FormData para enviar ao endpoint POST /anuncios
 */
export function buildAnuncioFormData(data: CriarAnuncioParams): FormData {
  const form = new FormData();

  // 1) Campos simples
  const simples: Record<string, string> = {
    Nome: data.nome,
    Descricao: data.descricao,
    Saidas: data.saidas,
    LugarEncontro: data.lugarEncontro.join(", "),
    ServicoPrestado: data.servicoPrestado,
    ServicoEspecial: data.servicoEspecial,
    Idade: data.idade?.toString() ?? "",
    Peso: data.peso?.toString() ?? "",
    Altura: data.altura?.toString() ?? "",
    Endereco: data.endereco,
    Cidade: data.cidade,
    Estado: data.estado,
    Bairro: data.bairro,
    Latitude: data.latitude?.toString() ?? "",
    Longitude: data.longitude?.toString() ?? "",
  };
  for (const [key, val] of Object.entries(simples)) {
    if (val) {
      form.append(key, val);
    }
  }

  // 2) SobreUsuario
  if (data.sobreUsuario) {
    if (data.sobreUsuario.atendimento.length > 0) {
      form.append(
        "SobreUsuario.Atendimento",
        data.sobreUsuario.atendimento.join(", ")
      );
    }
    form.append("SobreUsuario.Etnia", data.sobreUsuario.etnia);
    form.append("SobreUsuario.Relacionamento", data.sobreUsuario.relacionamento);
    form.append("SobreUsuario.Cabelo", data.sobreUsuario.cabelo);
    form.append("SobreUsuario.Estatura", data.sobreUsuario.estatura);
    form.append("SobreUsuario.Corpo", data.sobreUsuario.corpo);
    form.append("SobreUsuario.Seios", data.sobreUsuario.seios);
    form.append("SobreUsuario.Pubis", data.sobreUsuario.pubis);
  }

  // 3) Caches
  data.caches
    .filter((c) => c.descricao && c.valor > 0)
    .forEach((cache, i) => {
      form.append(`Caches[${i}].Descricao`, cache.descricao);
      form.append(`Caches[${i}].FormaPagamento`, cache.formaPagamento);
      form.append(`Caches[${i}].Valor`, cache.valor.toString());
    });

  // 4) Fotos
  data.fotos.forEach((file) => {
    form.append("Fotos", file, file.name);
  });

  // 5) Vídeo (opcional)
  if (data.video) {
    form.append("Video", data.video, data.video.name);
  }

  return form;
}

/**
 * Chama a API em POST /anuncios
 */
export async function criarAnuncio(
  data: CriarAnuncioParams
): Promise<CriarAnuncioResponse> {
  const formData = buildAnuncioFormData(data);

  // log de todas as entradas do FormData
  console.log("📤 FormData entries before sending:");
  Array.from(formData.entries())
    .forEach(([key, value]) => {
      // se for File, exibe apenas o nome
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

  // Opcional: log do endpoint e método
  console.log("🌐 Enviando POST /anuncios com FormData");

  const response = await api.post<CriarAnuncioResponse>(
    "/anuncios",
    formData
  );

  // log da resposta recebida
  console.log("✅ Resposta criarAnuncio:", response.data);

  return response.data;
}
