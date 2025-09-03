"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle, Circle } from "lucide-react";

interface ChecklistItem {
  id: string;
  question: string;
  checked: boolean;
}

interface Props {
  vehicleId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (vehicleId: string) => void;
}

const VeiculoDialog = ({ vehicleId, isOpen, onClose, onComplete }: Props) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (isOpen && vehicleId) {
      setChecklist([
        { id: "1", question: "Verificar óleo", checked: false },
        { id: "2", question: "Verificar pneus", checked: false },
        { id: "3", question: "Verificar freios", checked: false },
      ]);
    }
  }, [isOpen, vehicleId]);

  const toggleItem = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const allChecked = checklist.every((item) => item.checked);

  const handleComplete = () => {
    if (vehicleId) {
      onComplete(vehicleId); // aqui você vai fazer o PUT no banco
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Checklist - Ônibus {vehicleId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {checklist.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start p-3"
              onClick={() => toggleItem(item.id)}
            >
              {item.checked ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 mr-2" />
              )}
              {item.question}
            </Button>
          ))}
        </div>

        <Button
          disabled={!allChecked}
          onClick={handleComplete}
          className="w-full mt-4"
        >
          Concluir Checklist
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default VeiculoDialog;
