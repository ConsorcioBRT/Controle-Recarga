"use client";

import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
  const [eletroposto, setEletroposto] = useState<{ UndRdz: string }[]>([]);
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http:localhost:3000";

  useEffect(() => {
    async function fetchConsorciadas() {
      try {
        const res = await fetch(`${baseUrl}/api/eletroposto`);
        if (!res.ok) {
          throw new Error("Erro ao buscar consorciadas");
        }
        const data = await res.json();
        setEletroposto(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    }

    fetchConsorciadas();
  });

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
              {eletroposto.map((ele, index) => (
                <SelectItem key={index} value={ele.UndRdz}>
                  {ele.UndRdz}
                </SelectItem>
              ))}
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
