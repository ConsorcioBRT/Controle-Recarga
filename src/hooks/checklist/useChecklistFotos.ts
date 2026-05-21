"use client";

import { useState } from "react";
import { FotosPorPergunta } from "@/src/lib/checklist/types";

export function useChecklistFotos() {
  const [fotosPorPergunta, setFotosPorPergunta] = useState<FotosPorPergunta>(
    {},
  );

  function adicionarFotos(psqPrgId: number, files: FileList | null) {
    if (!files || files.length === 0) return;

    const novasFotos = Array.from(files);

    setFotosPorPergunta((prev) => ({
      ...prev,
      [psqPrgId]: [...(prev[psqPrgId] ?? []), ...novasFotos],
    }));
  }

  function removerFoto(psqPrgId: number, indexFoto: number) {
    setFotosPorPergunta((prev) => ({
      ...prev,
      [psqPrgId]: (prev[psqPrgId] ?? []).filter(
        (_, index) => index !== indexFoto,
      ),
    }));
  }

  function limparFotosDaPergunta(psqPrgId: number) {
    setFotosPorPergunta((prev) => ({
      ...prev,
      [psqPrgId]: [],
    }));
  }

  return {
    fotosPorPergunta,
    adicionarFotos,
    removerFoto,
    limparFotosDaPergunta,
  };
}
