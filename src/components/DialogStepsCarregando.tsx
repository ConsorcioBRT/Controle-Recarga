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
import { Calendar } from "./ui/calendar";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";

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
  DtaFin?: string;
};

type Props = {
  item: OnibusCarregando;
  finalizarRecarga: (item: OnibusCarregando, dados: FormRecargaFinal) => void;
  reiniciarRecarga?: boolean;
};

const DialogStepsCarregando: React.FC<Props> = ({ item, finalizarRecarga }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormRecargaFinal>({
    percentualFinal: "",
    odometro: "",
    energia: "",
    houveFalha: "",
    descricaoFalha: "",
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [odometroPreenchido, setOdometroPreenchido] = useState(
    item.odometroPreenchido ?? false
  );
  const veiculoSelecionado = JSON.parse(
    localStorage.getItem("veiculoSelecionado") || "{}"
  );
  const odometroLocalStorage = veiculoSelecionado.Odometro || "";

  useEffect(() => {
    // Aqui vai pegar o odômetro do LocalStorage
    const dadosLocal = localStorage.getItem("formDataConfirmacao");
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

  // Aqui vai salvar sempre o formData quando mudar
  useEffect(() => {
    localStorage.setItem("formDataConfirmacao", JSON.stringify(formData));
  }, [formData]);

  const odometroObrigatorio = !odometroPreenchido;
  const odometroValido = formData.odometro !== "";

  const handleProximo = () => {
    // Step 1 - Percentual
    if (step === 1 && !formData.percentualFinal) {
      return alert("Preencha o percentual");
    }

    // Step 2 - Energia utilizada
    if (step === 2 && !formData.energia) {
      return alert("Preencha a energia utilizada");
    }

    // Step 3 - Odômetro (só se for obrigatório)
    if (step === 3) {
      if (odometroObrigatorio && !odometroValido) {
        return alert("Preencha o odômetro");
      }
      // Se não for obrigatório, pula direto para o Step 4
      if (!odometroObrigatorio) {
        setStep(4);
        return;
      }
    }

    // Pula Step 3 se odômetro não for obrigatório
    if (step === 2 && !odometroObrigatorio) {
      setStep(4);
      return;
    }

    setStep(step + 1);
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
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (Number(value) >= 0 && Number(value) <= 100)
              ) {
                setFormData((prev) => ({ ...prev, percentualFinal: value }));
              }
            }}
            className="bg-white"
          />
        </div>
      )}

      {/* STEP 2: Energia */}
      {step === 2 && (
        <div className="grid gap-3">
          <Label>Energia Utilizada (kWh)</Label>
          <Input
            type="text"
            value={formData.energia}
            onChange={(e) => {
              let value = e.target.value;

              value = value.replace(/[^\d,]/g, ""); // Aqui remove o que não for número

              // Divide parte inteira e decimal
              const [integer, decimal] = value.split(",");

              // Formata parte inteira com separador de milhar
              const formattedInteger = integer.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                "."
              );

              // Monta novamente
              let formattedValue = formattedInteger;
              if (decimal !== undefined) {
                formattedValue += "," + decimal;
              }
              setFormData((prev) => ({ ...prev, energia: formattedValue }));
            }}
            className="bg-white"
          />
        </div>
      )}

      {/* STEP 3: Odômetro */}
      {step === 3 && odometroObrigatorio && (
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Label>Odômetro (km):</Label>
            <span className="text-gray-800">{odometroLocalStorage} km</span>
          </div>

          <Label>Coloque o odômetro novamente:</Label>
          <Input
            type="text"
            value={formData.odometro}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, odometro: e.target.value }))
            }
          />
        </div>
      )}

      {/* STEP 4: Calendário */}
      {step === 4 && (
        <div className="grid gap-3">
          <Label>Dia da Finalização:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (!d) return;
                  const novaData = new Date(d);
                  if (date) {
                    novaData.setHours(date.getHours());
                    novaData.setMinutes(date.getMinutes());
                  }
                  setDate(novaData);
                }}
              />
            </PopoverContent>
          </Popover>
          <Label>Hora da Finalização:</Label>
          <Input
            type="time"
            value={
              date
                ? `${String(date.getHours()).padStart(2, "0")}:${String(
                    date.getMinutes()
                  ).padStart(2, "0")}`
                : ""
            }
            onChange={(e) => {
              if (!date) return;
              const [h, m] = e.target.value.split(":").map(Number);
              const novaData = new Date(date);
              novaData.setHours(h);
              novaData.setMinutes(m);
              setDate(novaData);
            }}
            className="p-2 border rounded bg-white w-full"
          />
        </div>
      )}

      {/* STEP 5: Falhas */}
      {step === 5 && (
        <div className="grid gap-3">
          <Label>Houve Falhas?</Label>
          <Select
            value={formData.houveFalha}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, houveFalha: val }))
            }
          >
            <SelectTrigger className="bg-white">
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
                className="bg-white"
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

          {step < 5 ? (
            <Button
              className="w-full h-14 bg-green-500 text-lg font-bold"
              onClick={handleProximo}
            >
              Próximo
            </Button>
          ) : (
            <div className="flex gap-4 w-full">
              <DialogClose asChild>
                {/* Botão de Reiniciar */}
                <Button
                  onClick={() => {
                    if (!date)
                      return alert("Selecione o Dia e Hora da finalização!");
                    // Vai chamar a função do Finalizar
                    const payload: FormRecargaFinal = {
                      ...formData,
                      energia: formData.energia.replace(",", "."),
                      DtaFin: date.toISOString(),
                      houveFalha: "sim",
                      descricaoFalha:
                        formData.descricaoFalha || "Reinício de recarga",
                    };

                    finalizarRecarga(item, payload);
                  }}
                  className="flex-1 h-14 bg-red-500 text-lg font-bold"
                >
                  Reiniciar
                </Button>
              </DialogClose>

              {/* Botão de Finalizar */}
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (!date)
                      return alert("Selecione o Dia e Hora da finalização!");
                    finalizarRecarga(item, {
                      ...formData,
                      DtaFin: date.toISOString(),
                      forcarSttRcgId6: true,
                    });
                  }}
                  className="w-full h-14 bg-green-500 text-lg font-bold"
                >
                  Finalizar
                </Button>
              </DialogClose>
            </div>
          )}
        </div>
      </DialogFooter>
    </div>
  );
};

export default DialogStepsCarregando;
