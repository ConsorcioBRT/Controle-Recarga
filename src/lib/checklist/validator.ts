import { Pergunta, RespostaWizard } from "./types";

type ValidacaoInput = {
  perguntas: Pergunta[];
  respostas: RespostaWizard[];
  assunto: string;
  undId: string;
  carregadorId: string;
  eqpItmId: string;
};

export function validarChecklistAntesDeEnviar({
  perguntas,
  respostas,
  assunto,
  undId,
  carregadorId,
  eqpItmId,
}: ValidacaoInput): string | null {
  for (const pergunta of perguntas) {
    const resposta = respostas.find((r) => r.PsqPrgId === pergunta.PsqPrgId);

    if (!resposta?.resposta) {
      return "Responda todas as perguntas antes de enviar.";
    }

    if (
      resposta.resposta === "NAO" &&
      resposta.justificativa.trim().length === 0
    ) {
      return "Preencha a justificativa nas respostas 'Não'.";
    }
  }

  if (assunto === "ELETROPOSTO" && (!undId || !carregadorId)) {
    return "Selecione o eletroposto e o carregador.";
  }

  if (assunto === "VEICULO" && !eqpItmId) {
    return "Selecione o veículo.";
  }

  return null;
}
