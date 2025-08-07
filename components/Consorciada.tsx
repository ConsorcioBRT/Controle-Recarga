"use client";

import React from "react";
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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Search } from "lucide-react";

const Consorciada = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl">Consorciada</h1>
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
              Adionar Consorciada
              <PlusCircle />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Consorciada</DialogTitle>
                <DialogDescription>
                  Adicione uma Nova Consorciada.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                <div>
                  <span>Nome</span>
                  <Input />
                </div>
                <div>
                  <span>Fabricante</span>
                  <Input />
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
          <Table className="w-full">
            <TableCaption>Lista de Consorciadas cadastrados.</TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-black">Id</TableHead>
                <TableHead className="text-black">Nome</TableHead>
                <TableHead className="text-black">Fabricante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>HP Transportes</TableCell>
                <TableCell>HP1203</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>HP Transportes</TableCell>
                <TableCell>HP1203</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>HP Transportes</TableCell>
                <TableCell>HP1203</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>HP Transportes</TableCell>
                <TableCell>HP1203</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>HP Transportes</TableCell>
                <TableCell>HP1203</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>HP Transportes</TableCell>
                <TableCell>HP1203</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>HP Transportes</TableCell>
                <TableCell>HP1203</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Consorciada;
