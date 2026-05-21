"use client";

import { Button } from "@/src/components/ui/button";
import { EletropostoAPI } from "@/src/lib/checklist/types";

type Props = {
  eletropostos: EletropostoAPI[];
  undId: string;
  loading: boolean;
  onSelect: (value: string) => void;
};

export default function EletropostoStep({
  eletropostos,
  undId,
  loading,
  onSelect,
}: Props) {
  if (loading) {
    return (
      <div className="text-sm text-gray-500">Carregando eletropostos...</div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        {eletropostos.map((eletro) => (
          <Button
            key={eletro.UndId}
            type="button"
            variant={undId === String(eletro.UndId) ? "default" : "outline"}
            className="justify-start h-12 bg-green-500 text-white"
            onClick={() => onSelect(String(eletro.UndId))}
          >
            {eletro.PostoRecarga}
          </Button>
        ))}
      </div>
    </div>
  );
}
