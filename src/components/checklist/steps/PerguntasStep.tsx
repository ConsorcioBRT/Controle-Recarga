"use client";

import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Pergunta,
  RespostaWizard,
  FotosPorPergunta,
} from "@/src/lib/checklist/types";
import QuestionPhotoUploader from "../question/QuestionPhotoUploader";
import QuestionPhotoList from "../question/QuestionPhotoList";

type Props = {
  perguntaAtual: Pergunta | null;
  respostaAtual: RespostaWizard | null;
  loading: boolean;
  fotosPorPergunta: FotosPorPergunta;
  onMarcarSim: () => void;
  onMarcarNao: () => void;
  onJustificativaChange: (value: string) => void;
  onAdicionarFotos: (files: FileList | null) => void;
  onRemoverFoto: (index: number) => void;
};

export default function PerguntasStep({
  perguntaAtual,
  respostaAtual,
  loading,
  fotosPorPergunta,
  onMarcarSim,
  onMarcarNao,
  onJustificativaChange,
  onAdicionarFotos,
  onRemoverFoto,
}: Props) {
  if (!perguntaAtual) {
    return (
      <div className="text-sm text-gray-500">
        {loading ? "Carregando perguntas..." : "Sem perguntas."}
      </div>
    );
  }

  const fotos = fotosPorPergunta[perguntaAtual.PsqPrgId] ?? [];

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold">{perguntaAtual.Pergunta}?</div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={respostaAtual?.resposta === "SIM" ? "default" : "outline"}
          className="flex-1 hover:bg-green-500"
          onClick={onMarcarSim}
        >
          Sim
        </Button>

        <Button
          type="button"
          variant={respostaAtual?.resposta === "NAO" ? "default" : "outline"}
          className="flex-1 hover:bg-red-500"
          onClick={onMarcarNao}
        >
          Não
        </Button>
      </div>

      {respostaAtual?.resposta === "NAO" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <span className="text-xs text-gray-500">Descreva a avaria:</span>

            <Textarea
              placeholder="Descreva a avaria / justificativa..."
              value={respostaAtual.justificativa ?? ""}
              onChange={(e) => onJustificativaChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-gray-500">
              Tire uma foto ou selecione da galeria:
            </span>

            <QuestionPhotoUploader onChange={onAdicionarFotos} />
            <QuestionPhotoList fotos={fotos} onRemove={onRemoverFoto} />
          </div>
        </div>
      )}
    </div>
  );
}
