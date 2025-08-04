"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
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
            className="shadow-xl rounded-full"
          />
        </div>
        <div>
          <Label className="text-lg font-bold">Usuário</Label>
          <div className="relative w-64">
            <Input type="email" className="h-12 w-64" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <User />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-lg font-bold">Senha</Label>
          <div className="relative w-64">
            <Input type="password" className="h-12 w-64" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock />
            </div>
          </div>
        </div>
        <Link href="/home" className="w-full h-12 text-lg">
          <Button
            className="w-full h-12 text-lg"
            style={{
              background:
                "linear-gradient(90deg,rgba(55, 156, 196, 1) 0%, rgba(122, 250, 131, 1) 81%, rgba(158, 252, 35, 1) 100%)",
            }}
          >
            Entrar
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
