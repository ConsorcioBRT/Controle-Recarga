import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Button } from "./ui/button";

const TrocarSenha = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Div onde irá ficar o forms de login e senha */}
      <div className="flex flex-col gap-6 p-6 w-80 items-center justify-center shadow-xl rounded-xl">
        <div>
          <Image
            src="/image/brtgo_logo.jpg"
            alt="Logo"
            width={160}
            height={140}
            className="rounded-full"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold mb-5">Alterar de Senha</h1>
        </div>
        <div>
          <Label className="text-base font-bold">Senha atual:</Label>
          <div className="relative w-64">
            <Input type="password" className="h-12 w-64" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-base font-bold">Senha Nova:</Label>
          <div className="relative w-64">
            <Input type="password" className="h-12 w-64" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-base font-bold">Confirmar Senha:</Label>
          <div className="relative w-64">
            <Input type="password" className="h-12 w-64" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock />
            </div>
          </div>
        </div>

        <Button className="w-full h-12 text-lg bg-gray-800">Entrar</Button>
      </div>
    </div>
  );
};

export default TrocarSenha;
