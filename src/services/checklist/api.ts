import {
  Tipo,
  Pergunta,
  EletropostoAPI,
  CarregadorAPI,
  VeiculoAPI,
} from "@/src/lib/checklist/types";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar ${url}`);
  }

  return response.json();
}

export const checklistApi = {
  getTipos: () => fetchJson<Tipo[]>("/api/checklistTipos"),

  getPerguntas: (tipoId: string) =>
    fetchJson<Pergunta[]>(`/api/checklistPerguntas?PsqTpoId=${tipoId}`),

  getEletropostos: () => fetchJson<EletropostoAPI[]>("/api/eletroposto"),

  getCarregadores: (undId: string) =>
    fetchJson<CarregadorAPI[]>(`/api/carregadores?undId=${undId}`),

  getVeiculos: () => fetchJson<VeiculoAPI[]>("/api/veiculos"),

  enviarRespostas: async (payload: unknown) => {
    const response = await fetch("/api/respostaCheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Erro ao enviar checklist");
    }

    return text;
  },
};
