import { formatarDataLocal } from "./utils";
import { Pergunta, RespostaWizard } from "./types";

type BuildPayloadParams = {
  perguntas: Pergunta[];
  respostas: RespostaWizard[];
  tipoId: string;
  assunto: string;
  undId: string;
  carregadorId: string;
  eqpItmId: string;
  user: { UsrId: number };
  turno: { TrnId: number };
  eletropostoSelecionado?: { UndId: number } | null;
};

export function buildChecklistPayload({
  respostas,
  tipoId,
  assunto,
  undId,
  carregadorId,
  eqpItmId,
  user,
  turno,
  eletropostoSelecionado,
}: BuildPayloadParams) {
  const agora = new Date();
  const dataFormatada = formatarDataLocal(agora);

  const undIdFinal =
    assunto === "ELETROPOSTO"
      ? Number(undId)
      : (eletropostoSelecionado?.UndId ?? null);

  const eqpItmIdFinal =
    assunto === "VEICULO"
      ? eqpItmId
        ? Number(eqpItmId)
        : null
      : assunto === "ELETROPOSTO"
        ? carregadorId
          ? Number(carregadorId)
          : null
        : null;

  return respostas
    .filter((r) => r.resposta === "NAO")
    .map((r) => ({
      UndId: Number(undIdFinal ?? 0),
      DtaOpe: dataFormatada,
      TrnId: Number(turno.TrnId),
      PsqId: 1,
      PsqTpoId: Number(tipoId),
      EqpItmId: eqpItmIdFinal,
      PsqPrgId: Number(r.PsqPrgId),
      PsqRsp: 0,
      PsqDth: r.justificativa.trim(),
      SttId: 1,
      UsrIdAlt: Number(user.UsrId),
      DtaAlt: dataFormatada,
    }));
}
