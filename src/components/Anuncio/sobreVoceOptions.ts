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

export const opcoesCabelo: MultiSelectFieldOption[] = [
  { value: "Morenas", label: "Morenas" },
  { value: "Loiras", label: "Loiras" },
  { value: "Ruivas", label: "Ruivas" },
];

export const opcoesEstatura: MultiSelectFieldOption[] = [
  { value: "Altas", label: "Altas" },
  { value: "Mignon", label: "Mignon" },
];

export const opcoesCorpo: MultiSelectFieldOption[] = [
  { value: "Gordinhas", label: "Gordinhas" },
  { value: "Magras", label: "Magras" },
];

export const opcoesSeios: MultiSelectFieldOption[] = [
  { value: "Peitudas", label: "Peitudas" },
  { value: "Seios naturais", label: "Seios naturais" },
];

export const opcoesPubis: MultiSelectFieldOption[] = [
  { value: "Peludas", label: "Peludas" },
  { value: "Pubis depilado", label: "Pubis depilado" },
];

export const opcoesPagamento: MultiSelectFieldOption[] = [
  { value: "Cartão de crédito", label: "Cartão de crédito" },
  { value: "PIX", label: "PIX" },
  { value: "Dinheiro", label: "Dinheiro" },
  { value: "Transferência", label: "Transferência" },
];
