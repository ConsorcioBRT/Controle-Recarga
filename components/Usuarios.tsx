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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Pen, PlusCircle, Search, Trash } from "lucide-react";

const Usuarios = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl">Usuários</h1>
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
              Adionar Operador
              <PlusCircle />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Operador</DialogTitle>
                <DialogDescription>
                  Adicione um Novo Operador.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                <div>
                  <span>Nome</span>
                  <Input />
                </div>
                <div>
                  <span>E-mail</span>
                  <Input />
                </div>
                <div>
                  <span>Telefone</span>
                  <Input />
                </div>
                <div>
                  <span>Setor</span>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fin">Financeiro</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="eng">Engenheiro</SelectItem>
                      <SelectItem value="ope">Operação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span>Status</span>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="desativo">Desativo</SelectItem>
                      <SelectItem value="excluido">Excluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span>Permissão</span>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">
                        Administrador
                      </SelectItem>
                      <SelectItem value="operador">Operador</SelectItem>
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
          <Table className="w-full">
            <TableCaption>Lista de Operadores cadastrados.</TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-black">Id</TableHead>
                <TableHead className="text-black">Nome</TableHead>
                <TableHead className="text-black">E-mail</TableHead>
                <TableHead className="text-black">Telefone</TableHead>
                <TableHead className="text-black">Setor</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Permissão</TableHead>
                <TableHead className="text-black text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>José Rodrigues</TableCell>
                <TableCell>joser@gmail.com</TableCell>
                <TableCell>(62) 9 9999-9999</TableCell>
                <TableCell>Financeiro</TableCell>
                <TableCell className="text-green-500">Ativo</TableCell>
                <TableCell>Administrador</TableCell>
                <TableCell className="text-right">
                  <Button className="bg-transparent text-black shadow-none hover:bg-transparent hover:text-blue-500">
                    <Pen />
                  </Button>
                  <Button className="bg-transparent text-black shadow-none hover:bg-transparent hover:text-red-500">
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
