import { VeiculoAPI } from "./types";

export function formatarDataLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`;
}

export function extrairNumero(texto: string): number | null {
  const match = (texto ?? "").match(/\d+/);
  if (!match) return null;

  const numero = Number(match[0]);
  return Number.isFinite(numero) ? numero : null;
}

export function ordenarVeiculos(veiculos: VeiculoAPI[]): VeiculoAPI[] {
  return [...veiculos].sort((a, b) => {
    const na = extrairNumero(a.Onibus);
    const nb = extrairNumero(b.Onibus);

    if (na !== null && nb !== null) return na - nb;
    if (na !== null) return -1;
    if (nb !== null) return 1;

    return (a.Onibus ?? "").localeCompare(b.Onibus ?? "", "pt-BR", {
      numeric: true,
      sensitivity: "base",
    });
  });
}
