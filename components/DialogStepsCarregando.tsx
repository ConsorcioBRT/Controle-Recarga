import React, { useEffect, useState } from "react";
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
  odometroPreenchido?: boolean;
};

type FormRecargaFinal = {
  percentualFinal: string;
  odometro: string;
  energia: string;
  houveFalha: string;
  descricaoFalha?: string;
  forcarSttRcgId6?: boolean;
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

  const [odometroPreenchido, setOdometroPreenchido] = useState(
    item.odometroPreenchido ?? false
  );

  useEffect(() => {
    // Aqui vai pegar o odômetro do LocalStorage
    const dadosLocal = localStorage.getItem("formDataConfirmação");
    if (dadosLocal) {
      const dados = JSON.parse(dadosLocal);
      if (dados.odometro) {
        setFormData((prev) => ({
          ...prev,
          odometro: dados.odometro,
        }));
        setOdometroPreenchido(true);
      }
    }
  }, []);

  const odometroObrigatorio = !item.odometroPreenchido;
  const odometroValido = formData.odometro !== "";

  const handleProximo = () => {
    // Step 1 - Percentual
    if (step === 1 && !formData.percentualFinal) {
      return alert("Preencha o percentual");
    }

    // Step 3 - Odômetro (só se for obrigatório)
    if (step === 3 && odometroObrigatorio && !odometroValido) {
      return alert("Preencha o odômetro");
    }

    // Vai pular o Step 3 se já tiver o odômetro preenchido
    if (step === 2 && !odometroObrigatorio) {
      setStep(4);
    } else {
      setStep(step + 1);
    }
  };

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
      {step === 3 && odometroObrigatorio && (
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
              onClick={handleProximo}
            >
              Próximo
            </Button>
          ) : (
            <div className="flex gap-4 w-full">
              {/* Botão de Finalizar */}
              <Button
                onClick={() => {
                  finalizarRecarga(item, {
                    ...formData,
                    forcarSttRcgId6: true,
                  });
                }}
                className="w-full h-14 bg-yellow-500 text-lg font-bold"
              >
                Finalizar
              </Button>

              {/* Botão de Reiniciar */}
              {iniciarNovamente && (
                <Button
                  onClick={() => {
                    // Vai chamar a função do Finalizar
                    finalizarRecarga(item, {
                      ...formData,
                      houveFalha: "sim",
                      descricaoFalha:
                        formData.descricaoFalha || "Reinício de recarga",
                    });
                    // depois vai chamar a criação de nova recarga
                    iniciarNovamente(item);
                  }}
                  className="flex-1 h-14 bg-red-500 text-lg font-bold"
                >
                  Reiniciar
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogFooter>
    </div>
  );
};

export default DialogStepsCarregando;
