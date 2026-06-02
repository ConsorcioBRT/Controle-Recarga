"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const AvisoManometro = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <div className="bg-yellow-100 p-4 rounded-full">
          <AlertTriangle
            className="w-10 h-10 text-yellow-500"
            strokeWidth={1.5}
          />
        </div>

        <p className="text-justify text-gray-700 text-base font-medium leading-relaxed">
          Ao iniciar seu Turno de trabalho, antes de iniciar o carregamento de qualquer veículo, é necessário
          fazer a medição do tanque de Abastecimento (Carreta de Gás):
        </p>
        <p className="text-justify text-gray-700 text-base font-medium leading-relaxed">Registrando a quantidade de <span className="font-bold">BAR</span> marcado no Manômetro da Carreta.</p>
        <p className="text-justify text-gray-700 text-base font-medium leading-relaxed"><span className="font-bold">Observação:</span> Antes de encerrar seu período de trabalho, faça outra medição para Finalizar seu turno.</p>

        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={() => router.push("/manometro")}
            className="h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
          >
            Registrar Agora
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/abastecimento")}
            className="h-12 text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Registrar Depois
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvisoManometro;
