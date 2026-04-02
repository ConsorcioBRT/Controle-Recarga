"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";

import AssuntoStep from "./steps/AssuntoStep";
import EletropostoStep from "./steps/EletropostoStep";
import PerguntasStep from "./steps/PerguntasStep";

import { useChecklistFotos } from "@/src/hooks/checklist/useChecklistFotos";
import { useChecklistData } from "@/src/hooks/checklist/useChecklistData";
import { RespostaWizard, Step } from "@/src/lib/checklist/types";
import {
  getEletropostoSelecionado,
  getTurnoAtual,
  getUsuarioLogado,
} from "@/src/lib/checklist/storage";
import { validarChecklistAntesDeEnviar } from "@/src/lib/checklist/validator";
import { buildChecklistPayload } from "@/src/lib/checklist/mapper";
import { checklistApi } from "@/src/services/checklist/api";
import { ID_ELETROPOSTO, ID_VEICULO } from "@/src/lib/checklist/constants";
import Header from "../Header";
import Footer from "../Footer";

export default function CheckList() {
  const [tipoId, setTipoId] = useState("");
  const [step, setStep] = useState<Step>("ASSUNTO");
  const [undId, setUndId] = useState("");
  const [carregadorId, setCarregadorId] = useState("");
  const [eqpItmId, setEqpItmId] = useState("");
  const [postoSelecionado, setPostoSelecionado] = useState<number | null>(null);

  const [qIndex, setQIndex] = useState(0);
  const [respostas, setRespostas] = useState<RespostaWizard[]>([]);
  const [sending, setSending] = useState(false);

  const {
    fotosPorPergunta,
    adicionarFotos,
    removerFoto,
    limparFotosDaPergunta,
  } = useChecklistFotos();

  const {
    tipos,
    perguntas,
    eletropostos,
    carregadores,
    assunto,
    loadingTipos,
    loadingPerguntas,
    loadingEletro,
  } = useChecklistData(tipoId, step, postoSelecionado);

  useEffect(() => {
    const eletro = getEletropostoSelecionado();
    setPostoSelecionado(eletro?.UndId ?? null);
  }, []);

  const perguntaAtual = perguntas[qIndex] ?? null;

  const respostaAtual = useMemo(() => {
    if (!perguntaAtual) return null;
    return respostas.find((r) => r.PsqPrgId === perguntaAtual.PsqPrgId) ?? null;
  }, [perguntaAtual, respostas]);

  function setResposta(psqPrgId: number, patch: Partial<RespostaWizard>) {
    setRespostas((prev) => {
      const existing = prev.find((r) => r.PsqPrgId === psqPrgId);

      if (!existing) {
        return [
          ...prev,
          { PsqPrgId: psqPrgId, resposta: null, justificativa: "", ...patch },
        ];
      }

      return prev.map((r) =>
        r.PsqPrgId === psqPrgId ? { ...r, ...patch } : r,
      );
    });
  }

  function marcarSim() {
    if (!perguntaAtual) return;
    setResposta(perguntaAtual.PsqPrgId, {
      resposta: "SIM",
      justificativa: "",
    });
    limparFotosDaPergunta(perguntaAtual.PsqPrgId);
  }

  function marcarNao() {
    if (!perguntaAtual) return;
    setResposta(perguntaAtual.PsqPrgId, { resposta: "NAO" });
  }

  async function enviar() {
    const mensagemErro = validarChecklistAntesDeEnviar({
      perguntas,
      respostas,
      assunto,
      undId,
      carregadorId,
      eqpItmId,
    });

    if (mensagemErro) {
      alert(mensagemErro);
      return;
    }

    const user = getUsuarioLogado();
    const turno = getTurnoAtual();
    const eletro = getEletropostoSelecionado();

    if (!user || !turno) {
      alert("Faltam dados no localStorage (usuario/turno).");
      return;
    }

    const payload = buildChecklistPayload({
      perguntas,
      respostas,
      tipoId,
      assunto,
      undId,
      carregadorId,
      eqpItmId,
      user,
      turno,
      eletropostoSelecionado: eletro,
    });

    if (payload.length === 0) {
      alert("Nenhuma avaria registrada (tudo marcado como 'Sim').");
      return;
    }

    setSending(true);

    try {
      await checklistApi.enviarRespostas(payload);

      alert("Checklist enviado com sucesso!");
      setRespostas([]);
      setQIndex(0);

      if (assunto === "ELETROPOSTO") {
        setCarregadorId("");
        setStep("CARREGADOR");
      }

      if (assunto === "VEICULO") {
        setStep("VEICULO");
      }
    } catch (error) {
      console.error(error);
      alert("Falha ao enviar checklist.");
    } finally {
      setSending(false);
    }
  }

  function irProximo() {
    if (step === "ASSUNTO") {
      const id = Number(tipoId);

      if (id === ID_ELETROPOSTO) {
        setStep(postoSelecionado ? "CARREGADOR" : "ELETROPOSTO");
        if (postoSelecionado) setUndId(String(postoSelecionado));
        return;
      }

      if (id === ID_VEICULO) {
        setStep("VEICULO");
        return;
      }

      setStep("PERGUNTAS");
      return;
    }

    if (step === "ELETROPOSTO") return setStep("CARREGADOR");
    if (step === "CARREGADOR") return setStep("PERGUNTAS");
    if (step === "VEICULO") return setStep("PERGUNTAS");

    if (step === "PERGUNTAS") {
      if (qIndex < perguntas.length - 1) {
        setQIndex((prev) => prev + 1);
      } else {
        setStep("CONCLUIDO");
      }
    }
  }

  function renderStep() {
    switch (step) {
      case "ASSUNTO":
        return (
          <AssuntoStep
            tipos={tipos}
            tipoId={tipoId}
            loading={loadingTipos}
            onChange={setTipoId}
          />
        );

      case "ELETROPOSTO":
        return (
          <EletropostoStep
            eletropostos={eletropostos}
            undId={undId}
            loading={loadingEletro}
            onSelect={setUndId}
          />
        );

      case "PERGUNTAS":
        return (
          <PerguntasStep
            perguntaAtual={perguntaAtual}
            respostaAtual={respostaAtual}
            loading={loadingPerguntas}
            fotosPorPergunta={fotosPorPergunta}
            onMarcarSim={marcarSim}
            onMarcarNao={marcarNao}
            onJustificativaChange={(value) =>
              perguntaAtual &&
              setResposta(perguntaAtual.PsqPrgId, { justificativa: value })
            }
            onAdicionarFotos={(files) =>
              perguntaAtual && adicionarFotos(perguntaAtual.PsqPrgId, files)
            }
            onRemoverFoto={(index) =>
              perguntaAtual && removerFoto(perguntaAtual.PsqPrgId, index)
            }
          />
        );

      default:
        return <div>Etapa em construção...</div>;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-start justify-center p-1 pb-24">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 space-y-4">
          <h1 className="text-xl font-semibold">Checklist</h1>

          <div className="border rounded-2xl p-4 space-y-3">
            {renderStep()}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 bg-yellow-500 text-white"
              >
                Anterior
              </Button>

              {step === "CONCLUIDO" ? (
                <Button
                  type="button"
                  className="flex-1 h-12 text-base bg-blue-500"
                  disabled={sending}
                  onClick={enviar}
                >
                  {sending ? "Enviando..." : "Finalizar"}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="flex-1 h-12 text-base bg-blue-500"
                  onClick={irProximo}
                >
                  Próximo
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer className="fixed bottom-0 w-full" />
    </div>
  );
}
