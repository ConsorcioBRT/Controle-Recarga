"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";

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

const CheckListEletroposto = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      async function fetchChecklist() {
        try {
          const res = await fetch("/api/checklistEletroposto");
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
  }, [isDialogOpen]);

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
    // Bloqueia avançar se não marcou nada
    if (!currentItem.answer) return;

    // Bloqueia avançar se marcou "não" mas não escreveu justificativa
    if (currentItem.answer === "no" && !currentItem.note?.trim()) return;

    if (currentStep < checklist.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      await handleSaveResponses();
      console.log("Checklist concluído:", checklist);
    }
  };

  const handleSaveResponses = async () => {
    try {
      const usuarioLogado = localStorage.getItem("usuarioLogado"); // buscar o usuário pelo localStorage
      if (!usuarioLogado) {
        throw new Error("Usuário não encontrado no localStorage");
      }
      const usuario = JSON.parse(usuarioLogado);
      const UsrIdAlt = usuario.UsrId; // irá salvar o ID do usuário

      const respostasNao = checklist
        .filter((item) => item.answer === "no")
        .map((item) => ({
          PsqId: 1,
          PsqTpoId: 1,
          PsqPrgId: parseInt(item.id),
          PsqRsp: 0,
          PsqDth: item.note?.trim() || "",
          SttId: 1,
          UsrIdAlt: UsrIdAlt,
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

  const handleGoNextPage = () => {
    router.push("/abastecimento");
  };

  const currentItem = checklist[currentStep];

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-2">Checklist Eletroposto</h1>
        <span className="text-gray-600 text-sm text-center mb-8">
          Este Checklist é para avaliar as condições das Estações de recarga:
        </span>
      </div>

      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        Responder Checklist
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Checklist - Eletroposto</DialogTitle>
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
              <Button onClick={handleGoNextPage} className="w-full">
                Ir para próxima página
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

export default CheckListEletroposto;
