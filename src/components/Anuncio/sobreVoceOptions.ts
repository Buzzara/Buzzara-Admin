import { SelectFieldOption } from "./SelectField";
import { MultiSelectFieldOption } from "./MultiSelectField";

export const opcoesAtendimentoA: MultiSelectFieldOption[] = [
  { value: "Homens", label: "Homens" },
  { value: "Mulheres", label: "Mulheres" },
  { value: "Casais", label: "Casais" },
  { value: "Deficientes físicos", label: "Deficientes físicos" },
];

export const opcoesEtnia: SelectFieldOption[] = [
  { value: "Branca", label: "Branca" },
  { value: "Negra", label: "Negra" },
  { value: "Parda", label: "Parda" },
  { value: "Amarela", label: "Amarela" },
  { value: "Indígena", label: "Indígena" },
];

export const opcoesEtniaHomem: SelectFieldOption[] = [
  { value: "Branco", label: "Branco" },
  { value: "Negro", label: "Negro" },
  { value: "Latinos", label: "Latinos" },
  { value: "Mulatos", label: "Mulatos" },
  { value: "Orientais", label: "Orientais" },
];

export const opcoesCabelo: MultiSelectFieldOption[] = [
  { value: "Morenas", label: "Morenas" },
  { value: "Loiras", label: "Loiras" },
  { value: "Ruivas", label: "Ruivas" },
];
export const opcoesRol: MultiSelectFieldOption[] = [
  { value: "Passivo", label: "Passivo" },
  { value: "Ativos", label: "Ativos" },
  { value: "Versáteis", label: "Versáteis" },
];
export const opcoesEstatura: MultiSelectFieldOption[] = [
  { value: "Altas", label: "Altas" },
  { value: "Mignon", label: "Mignon" },
];

export const opcoesEstaturaHomem: MultiSelectFieldOption[] = [
  { value: "Altos", label: "Altos" },
  { value: "Baixinhos", label: "Baixinhos" },
];

export const opcoesCorpo: MultiSelectFieldOption[] = [
  { value: "Gordinhas", label: "Gordinhas" },
  { value: "Magras", label: "Magras" },
];
export const opcoesCorpoHomem: MultiSelectFieldOption[] = [
  { value: "Gordinho", label: "Gordinho" },
  { value: "Atléticos", label: "Atléticos" },
  { value: "Magros", label: "Magros" },
  { value: "Musculosos", label: "Musculosos" },
];

export const opcoesSeios: MultiSelectFieldOption[] = [
  { value: "Peitudas", label: "Peitudas" },
  { value: "Seios naturais", label: "Seios naturais" },
];

export const opcoesPubis: MultiSelectFieldOption[] = [
  { value: "Peludas", label: "Peludas" },
  { value: "Pubis depilado", label: "Pubis depilado" },
];

export const opcoesPubisHomem: MultiSelectFieldOption[] = [
  { value: "Peludos", label: "Peludos" },
  { value: "Pubis depilado", label: "Pubis depilado" },
];

export const opcoesPagamento: MultiSelectFieldOption[] = [
  { value: "Cartão de crédito", label: "Cartão de crédito" },
  { value: "PIX", label: "PIX" },
  { value: "Dinheiro", label: "Dinheiro" },
  { value: "Transferência", label: "Transferência" },
];
