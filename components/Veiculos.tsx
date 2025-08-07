"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Search } from "lucide-react";

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

const Veiculos = () => {
  const [consorciadas, setConsorciadas] = useState<{ FrnNme: string }[]>([]);

  useEffect(() => {
    async function fetchConsorciadas() {
      try {
        const res = await fetch("http://localhost:3000/api/consorciadas");
        if (!res.ok) {
          throw new Error("Erro ao buscar consorciadas");
        }
        const data = await res.json();
        setConsorciadas(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    }

    fetchConsorciadas();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl">Veículos</h1>
        <Separator className="mt-2 mb-5" />
      </div>

      {/* Corpo da Página */}
      <div className="p-5">
        {/* Search e Adionar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Input className="w-60 h-12" placeholder="Pesquise por Nome" />
            <Search className="text-gray-600" />
          </div>
          <Dialog>
            <DialogTrigger className="flex items-center gap-2 bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-500">
              Adionar Veículo
              <PlusCircle />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Veículo</DialogTitle>
                <DialogDescription>Adicione um Novo Veículo.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                <div>
                  <span>Número</span>
                  <Input />
                </div>
                <div>
                  <span>Consorciada</span>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {consorciadas.map((con, index) => (
                        <SelectItem key={index} value={con.FrnNme}>
                          {con.FrnNme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="h-12">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="h-12">
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela */}
        <div className="mt-10">
          <Table>
            <TableCaption>Lista de Veículos cadastrados.</TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-black">Id</TableHead>
                <TableHead className="text-black">Número</TableHead>
                <TableHead className="text-black">Consorciada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.map((veiculo, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{veiculo.id}</TableCell>
                  <TableCell className="font-medium">
                    {veiculo.onibusId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Veiculos;
