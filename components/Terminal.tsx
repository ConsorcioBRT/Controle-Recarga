"use client";

import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import Header from "./Header";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Texto seja bem-vindo */}
      <Header />
      <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-8 mt-40">
        <div className="flex flex-col items-start justify-center">
          <Label className="text-xl mb-3">Qual o seu Eletroposto?</Label>
          <Select>
            <SelectTrigger className="bg-white h-14 w-72 mb-10">
              <SelectValue placeholder="Eletropostos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cruzeiro">Cruzeiro</SelectItem>
              <SelectItem value="hp">Garagem HP</SelectItem>
              <SelectItem value="metrobus">Garagem Metrobus</SelectItem>
              <SelectItem value="ra">Garagem RA</SelectItem>
              <SelectItem value="isidoria">Isidória</SelectItem>
              <SelectItem value="paulo">Paulo Garcia</SelectItem>
              <SelectItem value="recanto">Recanto do Bosque</SelectItem>
              <SelectItem value="veiga">Veiga Jardim</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link href="/abastecimento">
          <Button className="h-14 w-72 text-lg bg-gray-800">Entrar</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
