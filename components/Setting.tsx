"use client";

import React from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const Setting = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl">Configurações</h1>
        <Separator className="mt-2 mb-5" />
      </div>

      {/* Corpo da Página */}
      <div className="bg-gray-100 p-10">
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="grid grid-cols-2 gap-10 w-full">
            <div>
              <Label>Nome</Label>
              <Input className="bg-white h-12 text-gray-600" />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input className="bg-white h-12 text-gray-600" />
            </div>
          </div>
          <div className="w-full">
            <Label>Setor</Label>
            <Select>
              <SelectTrigger className="w-full bg-white h-12 text-gray-600">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="eng">Engenheiro</SelectItem>
                <SelectItem value="ope">Operação</SelectItem>
                <SelectItem value="ti">TI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-52 h-12 bg-gray-800">Salvar</Button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
