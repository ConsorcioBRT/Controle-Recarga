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

const transportesLivres = [106, 107, 108, 109, 110, 201, 320];
const transportesCarregando = [350, 360];
const transportesConcluidos = [112];

const Abastecimento = () => {
  const [carregando, setCarregando] = useState<number[]>([]);
  const [resposta, setResposta] = useState("");

  return (
    <div>
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
                <form>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full bg-blue-500 text-white"
                    >
                      {item}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm w-full rounded-xl p-6">
                    <DialogHeader className="flex items-start">
                      <DialogTitle>
                        Ônibus{" "}
                        <span className="bg-blue-500 text-white p-1 rounded-full">
                          {item}
                        </span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 mt-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Percentual Inicial</Label>
                        <Input id="name-1" name="name" type="number" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Odômetro</Label>
                        <Input id="username-1" name="username" type="number" />
                      </div>
                    </div>
                    <DialogFooter>
                      <div className="flex items-center justify-between mt-4 gap-4">
                        <DialogClose asChild>
                          <Button variant="outline" className="w-full h-14">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          className="w-full h-14 bg-blue-500 text-lg font-bold"
                        >
                          Carregar
                        </Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </form>
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
                          className="rounded-full bg-orange-500 text-white"
                        >
                          {item}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm w-full rounded-xl p-6">
                        <DialogHeader className="flex items-start">
                          <DialogTitle>
                            Ônibus{" "}
                            <span className="bg-orange-500 text-white p-1 rounded-full">
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
                            <Label htmlFor="username-1">KW/h utilizados</Label>
                            <Input id="kw" name="kw" type="number" />
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
                                  <SelectValue placeholder="Selecione o Problema"/>
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
                              <Button variant="outline" className="w-full h-14">
                                Falha
                                <TriangleAlert />
                              </Button>
                            </DialogClose>
                            <Button
                              type="submit"
                              className="w-full h-14 bg-blue-500 text-lg font-bold"
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
          <Separator className="mt-20" />
        </div>

        {/* Onibus Concluídos */}
        <div className="mt-2">
          <span className="text-lg font-semibold text-gray-700">
            Ônibus Concluídos
          </span>
          <div className="mt-3 ml-1">
            {carregando.length === 1 ? (
              <p className="text-gray-500 text-sm italic">
                Nenhum ônibus concluído
              </p>
            ) : (
              <div className="flex flex-wrap gap-3 mt-2">
                {transportesConcluidos.map((item) => (
                  <span
                    key={item}
                    className="bg-green-500 text-white px-4 py-2 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Separator className="mt-20" />
        </div>
      </div>
    </div>
  );
};

export default Abastecimento;
