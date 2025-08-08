"use client";
import React, { useState } from "react";
import Header from "./Header";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import Footer from "./Footer";
import { Battery, Circle, Fuel, Gauge, PlugZap, Zap } from "lucide-react";

const transportesCarregando = [350, 360];
const carregadores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const conectores = ["1", "2", "ambos"];

const Abastecimento = () => {
  const [carregando] = useState<number[]>([]);
  const [resposta, setResposta] = useState("");
  const [odometro, setOdometro] = useState("");

  function formatarNumero(valor: string) {
    const semLetras = valor.replace(/\D/g, ""); // aqui não irá permitir letrar, apenas números
    return semLetras.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // aqui vai formatar os números com ponto
  }

  function handleOdometroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = e.target.value;
    const valorFormatado = formatarNumero(valorDigitado);
    setOdometro(valorFormatado);
  }

  const veiculos = [
    { id: "6", onibusId: "1201" },
    { id: "7", onibusId: "1202" },
    { id: "8", onibusId: "1203" },
    { id: "9", onibusId: "1204" },
    { id: "10", onibusId: "1205" },
    { id: "11", onibusId: "1206" },
    { id: "12", onibusId: "20805" },
    { id: "13", onibusId: "20806" },
    { id: "14", onibusId: "20807" },
    { id: "15", onibusId: "20808" },
    { id: "16", onibusId: "20809" },
    { id: "17", onibusId: "20810" },
    { id: "18", onibusId: "50900" },
    { id: "19", onibusId: "50901" },
    { id: "20", onibusId: "50902" },
    { id: "21", onibusId: "50903" },
    { id: "22", onibusId: "50904" },
    { id: "23", onibusId: "50905" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <Header />
        {/* Corpo da Página */}
        <div className="mt-5 mx-5">
          {/* Onibus Livres */}
          <div className="max-h-64 overflow-y-auto">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-blue-500 bg-blue-500 rounded-full" />
              <span className="text-lg font-semibold text-gray-700">
                Ônibus Livres ({veiculos.length})
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-2 gap-4 mt-5">
              {veiculos.map((item, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 bg-blue-500 text-white"
                    >
                      {item.onibusId}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm w-full rounded-xl p-6">
                    <DialogHeader className="flex items-start">
                      <DialogTitle className="flex items-center gap-2">
                        <Zap className="text-blue-500" />
                        Finalizar Recarga - Ônibus{" "}
                        <span className="bg-blue-500 text-white p-1 rounded-full">
                          {item.onibusId}
                        </span>
                      </DialogTitle>
                    </DialogHeader>

                    {/* Parte das STEPS */}
                    <DialogSteps />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            <Separator className="mt-5" />
          </div>

          {/* Onibus Carregando */}
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-yellow-500 bg-yellow-500 rounded-full" />
              <span className="text-lg font-semibold text-gray-700">
                Ônibus Carregando ({transportesCarregando.length})
              </span>
            </div>
            <div className="mt-3 ml-1">
              {carregando.length === 1 ? (
                <p className="text-gray-500 text-sm italic">
                  Nenhum ônibus carregando
                </p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-4 mt-5">
                  {transportesCarregando.map((item, index) => (
                    <Dialog key={index}>
                      <form>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="inline-flex items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 bg-yellow-500 text-white"
                          >
                            {item}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm w-full rounded-xl p-6">
                          <DialogHeader className="flex items-start">
                            <DialogTitle className="flex items-center gap-2">
                              <Zap className="text-yellow-500" />
                              Finalizar Recarga - Ônibus{" "}
                              <span className="bg-yellow-500 text-white p-1 rounded-full">
                                {item}
                              </span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 mt-6">
                            <div className="grid gap-3">
                              <Label className="flex items-center gap-2">
                                <Battery className="w-4 h-4" />
                                Percentual Final (%)
                              </Label>
                              <Input
                                id="percentual-final"
                                name="percentual-final"
                                type="number"
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label
                                htmlFor="kw"
                                className="flex items-center gap-2"
                              >
                                <Zap className="w-4 h-4" />
                                Energia Utilizada (kw/h)
                              </Label>
                              <Input id="kw" name="kw" type="number" />
                            </div>
                            <div className="grid gap-3">
                              <Label className="flex items-center gap-2">
                                <Gauge className="w-4 h-4" />
                                Odômetro (km)
                              </Label>
                              <Input
                                id="odometro"
                                type="text"
                                value={odometro}
                                onChange={handleOdometroChange}
                                placeholder="0"
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label>Houve Falhas?</Label>
                              <Select onValueChange={(val) => setResposta(val)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sim">Sim</SelectItem>
                                  <SelectItem value="nao">Não</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {resposta === "sim" && (
                              <div>
                                <Label>Tipo de Problema</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o Problema" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="interrompimento">
                                      Interrupção
                                    </SelectItem>
                                    <SelectItem value="carga-rapida">
                                      Carga Rápida
                                    </SelectItem>
                                    <SelectItem value="energia">
                                      Queda de Energia
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <div>
                                  <Label>Descrição</Label>
                                  <Textarea className="text-sm" />
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <div className="flex items-center justify-between mt-4 gap-4">
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  className="w-full h-14"
                                >
                                  Cancelar
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                className="w-full h-14 bg-gray-800 text-lg font-bold"
                              >
                                Concluir
                              </Button>
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </form>
                    </Dialog>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contagem de Ônibus Livres e Carregando */}
          <section className="grid grid-cols-2 gap-3 mt-8">
            <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="text-2xl font-bold text-blue-500">
                {veiculos.length}
              </div>
              <div className="text-sm text-muted-foreground">Disponíveis</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="text-2xl font-bold text-yellow-500">
                {transportesCarregando.length}
              </div>
              <div className="text-sm text-muted-foreground">Carregando</div>
            </div>
          </section>
        </div>
      </main>
      <Footer className="fixed bottom-0 w-full" />
    </div>
  );
};

export default Abastecimento;

{
  /* Função para Passar as Etapas */
}
const DialogSteps = () => {
  const [step, setStep] = useState(1);
  const [carregadorSelecionado, setCarregadorSelecionado] = useState<
    number | null
  >(null);
  const [conectorSelecionado, setConectorSelecionado] = useState<string | null>(
    null
  );
  const [odometro, setOdometro] = useState("");

  function formatarNumero(valor: string) {
    const semLetras = valor.replace(/\D/g, ""); // aqui não irá permitir letrar, apenas números
    return semLetras.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // aqui vai formatar os números com ponto
  }

  function handleOdometroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = e.target.value;
    const valorFormatado = formatarNumero(valorDigitado);
    setOdometro(valorFormatado);
  }

  /*
  // Na hora de salvar no banco, irá salvar sem pontuação
  function getValorOdometroParaSalvar() {
    return odometro.replace(/\./g, "");
  }
 */

  return (
    // Aqui onde irá fazer todo a parte do front-end, onde vai apenas chamar lá em cima, no primeiro Return
    <>
      <div className="grid gap-4 mt-6">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <Label className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Escolha um Carregador:
            </Label>
            <div className="grid grid-cols-5 gap-3">
              {carregadores.map((carregador) => (
                <Button
                  key={carregador}
                  onClick={() => setCarregadorSelecionado(carregador)}
                  className={`inline-flex items-center justify-center rounded-full text-lg font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 bg-blue-500 text-white ${
                    carregadorSelecionado === carregador
                      ? "bg-gray-500 text-white"
                      : "bg-blue-500"
                  }`}
                >
                  {carregador}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <Label className="flex items-center gap-2">
              <PlugZap />
              Escolha um Conector:
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {conectores.map((conector) => (
                <Button
                  key={conector}
                  onClick={() => setConectorSelecionado(conector)}
                  className={`inline-flex items-center justify-center rounded-full text-base font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-16 w-16 bg-blue-500 text-white ${
                    conectorSelecionado === conector
                      ? "bg-gray-500 text-white"
                      : "bg-blue-500"
                  }`}
                >
                  {conector}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                Percentual Inicial (%):
              </Label>
              <Input id="percentual" type="number" />
            </div>
            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Odômetro (km):
              </Label>
              <Input
                id="odometro"
                type="text"
                value={odometro}
                onChange={handleOdometroChange}
                placeholder="0"
              />
            </div>
            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Confirme  o Odômetro (km):
              </Label>
              <Input
                id="odometro"
                type="text"
                value={odometro}
                onChange={handleOdometroChange}
                placeholder="0"
              />
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <div className="flex items-center justify-between mt-4 gap-4">
          {step > 1 ? (
            <Button
              variant="outline"
              className="w-full h-14"
              onClick={() => setStep((prev) => prev - 1)}
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

          {step < 3 ? (
            <Button
              type="button"
              className="w-full h-14 bg-blue-500 text-lg font-bold"
              onClick={() => {
                if (step === 1 && !carregadorSelecionado) {
                  alert("Selecione um carregador.");
                  return;
                }
                if (step === 2 && !conectorSelecionado) {
                  alert("Selecione um conector.");
                  return;
                }
                setStep((prev) => prev + 1);
              }}
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-14 bg-blue-500 text-lg font-bold"
            >
              Carregar
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
};
