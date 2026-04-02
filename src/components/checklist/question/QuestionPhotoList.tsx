"use client";

import { Button } from "@/src/components/ui/button";

type Props = {
  fotos: File[];
  onRemove: (index: number) => void;
};

export default function QuestionPhotoList({ fotos, onRemove }: Props) {
  if (fotos.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-xs text-gray-500">Fotos selecionadas:</span>

      <div className="grid grid-cols-2 gap-2">
        {fotos.map((foto, index) => (
          <div
            key={`${foto.name}-${index}`}
            className="border rounded-lg p-2 space-y-2"
          >
            <div className="text-[11px] break-all text-gray-600">
              {foto.name}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onRemove(index)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
