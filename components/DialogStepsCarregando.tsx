import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

{
  /* Função para Passar as Etapas de Ônibus Carregando */
}

type OnibusCarregando = {
  Onibus: string;
  RcgId?: number;
};

type FormRecargaFinal = {
  percentualFinal: string;
  odometro: string;
  energia: string;
  houveFalha: string;
  descricaoFalha?: string;
};

type Props = {
  item: OnibusCarregando;
  finalizarRecarga: (item: OnibusCarregando, dados: FormRecargaFinal) => void;
  reiniciarRecarga?: boolean;
  iniciarNovamente?: (item: OnibusCarregando) => void; // aqui será onde vai chamar o DialogSteps
};

const DialogStepsCarregando: React.FC<Props> = ({
  item,
  finalizarRecarga,
  reiniciarRecarga = false,
  iniciarNovamente,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormRecargaFinal>({
    percentualFinal: "",
    odometro: "",
    energia: "",
    houveFalha: "",
    descricaoFalha: "",
  });

  const odometroValido = formData.odometro !== "";

  return (
    <div className="grid gap-4 mt-6">
      {/* STEP 1: Percentual Final */}
      {step === 1 && (
        <div className="grid gap-3">
          <Label>Percentual Final (%)</Label>
          <Input
            type="number"
            value={formData.percentualFinal}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                percentualFinal: e.target.value,
              }))
            }
          />
        </div>
      )}

      {/* STEP 2: Energia */}
      {step === 2 && (
        <div className="grid gap-3">
          <Label>Energia Utilizada (kWh)</Label>
          <Input
            type="number"
            value={formData.energia}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, energia: e.target.value }))
            }
          />
        </div>
      )}

      {/* STEP 3: Odômetro */}
      {step === 3 && (
        <div className="grid gap-3">
          <Label>Odômetro (km)</Label>
          <Input
            type="text"
            value={formData.odometro}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, odometro: e.target.value }))
            }
          />
          {!odometroValido && (
            <p className="text-red-600">Informe o odômetro</p>
          )}
        </div>
      )}

      {/* STEP 4: Falhas */}
      {step === 4 && (
        <div className="grid gap-3">
          <Label>Houve Falhas?</Label>
          <Select
            value={formData.houveFalha}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, houveFalha: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>

          {formData.houveFalha === "sim" && (
            <>
              <Label>Descrição</Label>
              <Textarea
                value={formData.descricaoFalha}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descricaoFalha: e.target.value,
                  }))
                }
              />
            </>
          )}
        </div>
      )}

      {/* Footer: Navegação entre Steps */}
      <DialogFooter>
        <div className="flex items-center justify-between mt-4 gap-4">
          {step > 1 ? (
            <Button
              variant="outline"
              className="w-full h-14"
              onClick={() => setStep(step - 1)}
            >
              Voltar
            </Button>
          ) : (
            <DialogClose asChild>
              <Button variant="outline" className="w-full h-14">
                Cancelar
              </Button>
            </DialogClose>
          )}

          {step < 4 ? (
            <Button
              className="w-full h-14 bg-yellow-500 text-lg font-bold"
              onClick={() => {
                if (step === 1 && !formData.percentualFinal)
                  return alert("Preencha o percentual");
                if (step === 3 && !odometroValido)
                  return alert("Preencha o odômetro");
                setStep(step + 1);
              }}
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (reiniciarRecarga && iniciarNovamente) {
                  iniciarNovamente(item); // abre o DialogSteps para reiniciar
                } else {
                  finalizarRecarga(item, formData);
                }
              }}
              className="w-full h-14 bg-yellow-500 text-lg font-bold"
            >
              {reiniciarRecarga ? "Reiniciar" : "Finalizar"}
            </Button>
          )}
        </div>
      </DialogFooter>
    </div>
  );
};

export default DialogStepsCarregando;
