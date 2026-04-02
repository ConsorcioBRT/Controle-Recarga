"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Tipo } from "@/src/lib/checklist/types";

type Props = {
  tipos: Tipo[];
  tipoId: string;
  loading: boolean;
  onChange: (value: string) => void;
};

export default function AssuntoStep({
  tipos,
  tipoId,
  loading,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Assunto</span>

      <Select value={tipoId} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue
            placeholder={loading ? "Carregando..." : "Selecione..."}
          />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {tipos.map((tipo) => (
              <SelectItem key={tipo.PsqTpoId} value={String(tipo.PsqTpoId)}>
                {tipo.PsqTpo}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
