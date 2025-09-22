import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { CheckCircle } from "lucide-react";

// Tipagem do Veiculo
type Veiculo = { Onibus: string; RcgId?: number; FlhId?: number };

// Props do componente
interface DialogStepsChecklistProps {
  veiculo: Veiculo;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChecklistCompleted?: (veiculo: Veiculo) => void;
}

interface ChecklistAPIItem {
  PsqPrgId: number;
  Pergunta: string;
}

interface ChecklistItem {
  id: string;
  question: string;
  answer: "yes" | "no" | null;
  note?: string;
}

const DialogStepsChecklist: React.FC<DialogStepsChecklistProps> = ({
  veiculo,
  isOpen,
  onOpenChange,
  onChecklistCompleted,
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      async function fetchChecklist() {
        try {
          const res = await fetch("/api/checklistOnibus");
          if (!res.ok) throw new Error("Erro ao buscar checklist");
          const data: ChecklistAPIItem[] = await res.json();

          const mappedChecklist: ChecklistItem[] = data.map((item) => ({
            id: item.PsqPrgId.toString(),
            question: item.Pergunta,
            answer: null,
          }));

          setChecklist(mappedChecklist);
          setCurrentStep(0);
          setIsCompleted(false);
        } catch (error) {
          console.error("Erro ao buscar checklist:", error);
          setCurrentStep(0);
          setIsCompleted(false);
        }
      }
      fetchChecklist();
    }
  }, [isOpen]);

  const handleAnswer = (value: "yes" | "no") => {
    setChecklist((prev) =>
      prev.map((item, index) =>
        index === currentStep
          ? {
              ...item,
              answer: value,
              note: value === "yes" ? "" : item.note || "",
            }
          : item
      )
    );
  };

  const handleNext = async () => {
    const currentItem = checklist[currentStep];
    if (!currentItem.answer) return; // não vai permitir avançar sem marcar
    if (currentItem.answer === "no" && !currentItem.note?.trim()) return;

    if (currentStep < checklist.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Atualizar SttIdChk = 1
  const atualizarSttIdChk = async () => {
    try {
      if (!veiculo.RcgId) return;
      const res = await fetch("/api/recarga/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RcgId: veiculo.RcgId, SttIdChk: 1 }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar checklist");
      console.log("Checklist atualizado no servidor!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveResponses = async () => {
    try {
      const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado") || "{}"
      );
      const usuarioId = usuarioLogado?.UsrId;

      const respostasNao = checklist
        .filter((item) => item.answer === "no")
        .map((item) => ({
          PsdId: 1,
          PsqTpoId: 2,
          PsqPrgId: parseInt(item.id),
          PsqRsp: 0,
          PsqDth: item.note?.trim() || "",
          SttId: 1,
          UsrIdAlt: usuarioId,
          DtaAlt: new Date().toISOString(),
        }));
      if (respostasNao.length === 0) return;

      const res = await fetch("/api/respostaCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(respostasNao),
      });
      const data = await res.text(); // pega o texto retornado do servidor

      if (!res.ok) throw new Error(data || "Erro ao salvar respostas");

      console.log("Respostas 'Não' salvas:", respostasNao);
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
    }
  };

  const currentItem = checklist[currentStep];

  return (
    <div className="grid gap-4 mt-6">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Checklist - Ônibus</DialogTitle>
          </DialogHeader>

          {!isCompleted && checklist.length > 0 && currentItem ? (
            <div className="flex flex-col items-center gap-4 mt-4">
              <span className="text-center font-medium border rounded-lg p-2 bg-green-100">
                {currentItem.question}?
              </span>

              <div className="flex gap-4">
                <Button
                  className={
                    currentItem.answer === "yes"
                      ? "bg-green-500 text-white hover:bg-green-300"
                      : "bg-white border hover:bg-gray-100 text-black"
                  }
                  onClick={() => handleAnswer("yes")}
                >
                  Sim
                </Button>
                <Button
                  variant={
                    currentItem.answer === "no" ? "destructive" : "outline"
                  }
                  onClick={() => handleAnswer("no")}
                >
                  Não
                </Button>
              </div>

              {currentItem.answer === "no" && (
                <Textarea
                  placeholder="Escreva o motivo..."
                  value={currentItem.note || ""}
                  onChange={(e) =>
                    setChecklist((prev) =>
                      prev.map((item, index) =>
                        index === currentStep
                          ? { ...item, note: e.target.value }
                          : item
                      )
                    )
                  }
                />
              )}

              <Button
                className="mt-4 w-full"
                onClick={handleNext}
                disabled={
                  currentItem.answer === null ||
                  (currentItem.answer === "no" && !currentItem.note?.trim())
                }
              >
                {currentStep === checklist.length - 1 ? "Concluir" : "Próximo"}
              </Button>
            </div>
          ) : isCompleted ? (
            <div className="flex flex-col items-center gap-6 mt-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <span className="font-medium text-lg text-center">
                Checklist concluído!
              </span>
              <Button
                className="w-full"
                onClick={() => {
                  // fecha imediatamente
                  onOpenChange(false); // ou setIsDialogOpen(false)

                  // dispara o salvamento sem bloquear o fechamento
                  (async () => {
                    try {
                      await handleSaveResponses();
                      await atualizarSttIdChk();
                      // Dispara callback para atualizar listas no pai
                      if (onChecklistCompleted) onChecklistCompleted(veiculo);
                    } catch (err) {
                      console.error(err);
                    }
                  })();
                }}
              >
                Finalizar
              </Button>
            </div>
          ) : (
            <p className="text-center mt-4">Carregando perguntas...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogStepsChecklist;
