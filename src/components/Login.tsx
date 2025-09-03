"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Usuario {
  UsrNme: string;
  UsrCpf: string;
  UsrEml: string;
  UsrId: number;
  UsrTpoId: number;
  UsrLgn: string;
}

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const loginPromise = fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message); // rejeita a promise
        }
        return res.json(); // resolve a promise
      });

      const data = await toast.promise(
        loginPromise,
        {
          loading: "Validando login...",
          success: "Login validado com sucesso!",
          error: (err) => `Erro: ${err.message}`,
        },
        {
          duration: 5000, // 5 segundos
          className: "text-xl p-2",
        }
      );

      const userLogged: Usuario = data.user;
      localStorage.setItem("usuarioLogado", JSON.stringify(userLogged));
      router.push("/terminal");
    } catch (error) {
      console.log("Erro no login:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Div onde irá ficar o forms de login e senha */}
      <div className="flex flex-col gap-6 p-6 w-80 items-center justify-center shadow-xl rounded-xl bg-white">
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
          <Label className="text-lg font-bold">Usuário</Label>
          <div className="relative w-64">
            <Input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="h-12 w-64 bg-gray-100"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <User />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-lg font-bold">Senha</Label>
          <div className="relative w-64">
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="h-12 w-64 bg-gray-100"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock />
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full h-12 text-lg bg-gray-800"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
};

export default Login;
