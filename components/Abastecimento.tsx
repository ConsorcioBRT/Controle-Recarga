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
import { TriangleAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import Footer from "./Footer";

const transportesLivres = [106, 107, 108, 109, 110, 201, 320];
const transportesCarregando = [350, 360];
const carregadores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const conectores = ["direito", "esquerdo", "ambos"];

const Abastecimento = () => {
  const [carregando, setCarregando] = useState<number[]>([]);
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Header />
        {/* Corpo da Página */}
        <div className="mt-5 mx-8">
          {/* Onibus Livres */}
          <div>
            <span className="text-lg font-semibold text-gray-700">
              Ônibus Livres
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-2 gap-4 mt-5">
              {transportesLivres.map((item, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-lg p-7 bg-gray-800 text-white"
                    >
                      {item}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm w-full rounded-xl p-6">
                    <DialogHeader className="flex items-start">
                      <DialogTitle>
                        - Ônibus{" "}
                        <span className="bg-gray-800 text-white p-1 rounded-sm">
                          {item}
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
            <span className="text-lg font-semibold text-gray-700">
              Ônibus Carregando
            </span>
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
                            className="rounded-lg p-7 bg-gray-800 text-white"
                          >
                            {item}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm w-full rounded-xl p-6">
                          <DialogHeader className="flex items-start">
                            <DialogTitle>
                              Ônibus{" "}
                              <span className="bg-gray-800 text-white p-1 rounded-lg">
                                {item}
                              </span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 mt-6">
                            <div className="grid gap-3">
                              <Label htmlFor="percentual-final">
                                Percentual Final
                              </Label>
                              <Input
                                id="percentual-final"
                                name="percentual-final"
                                type="number"
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="kw">KW/h utilizados</Label>
                              <Input id="kw" name="kw" type="number" />
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="username-1">Odômetro</Label>
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
                                      Interrompimento
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

  // Na hora de salvar no banco, irá salvar sem pontuação
  function getValorOdometroParaSalvar() {
    return odometro.replace(/\./g, "");
  }

  return (
    // Aqui onde irá fazer todo a parte do front-end, onde vai apenas chamar lá em cima, no primeiro Return
    <>
      <div className="grid gap-4 mt-6">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <Label>Escolha um Carregador</Label>
            <div className="grid grid-cols-3 gap-3">
              {carregadores.map((carregador) => (
                <Button
                  key={carregador}
                  onClick={() => setCarregadorSelecionado(carregador)}
                  className={`p-3 rounded border h-12 ${
                    carregadorSelecionado === carregador
                      ? "bg-gray-500 text-white"
                      : "bg-gray-300"
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
            <Label>Escolha um Carregador</Label>
            <div className="grid grid-cols-3 gap-3">
              {conectores.map((conector) => (
                <Button
                  key={conector}
                  onClick={() => setConectorSelecionado(conector)}
                  className={`p-3 rounded border h-12 ${
                    conectorSelecionado === conector
                      ? "bg-gray-500 text-white"
                      : "bg-gray-300"
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
              <Label>Percentual Inicial</Label>
              <Input id="percentual" type="number" />
            </div>
            <div className="grid gap-3">
              <Label>Odômetro</Label>
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
              className="w-full h-14 bg-gray-800 text-lg font-bold"
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
              className="w-full h-14 bg-gray-800 text-lg font-bold"
            >
              Carregar
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  );
};
