"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "react-hot-toast";

interface Usuario {
  UsrNme: string;
  UsrCpf: string;
  UsrEml: string;
  UsrId: number;
  UsrTpoId: number;
  UsrLgn: string;
}

type Eletroposto = {
  UndId: number;
  PostoRecarga: string;
};

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();
  const [postosUnicos, setPostosUnicos] = useState<Eletroposto[]>([]);
  const [contagem, setContagem] = useState<Record<number, number>>({});
  const [postoSelecionado, setPostoSelecionado] = useState<number | null>(null);
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

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
      // Irá salvar o usuário no "usuarioLogado"
      const userLogged: Usuario = data.user;
      localStorage.setItem("usuarioLogado", JSON.stringify(userLogged));
      // irá salvar o eletroposto em "eletropostoSelecionado"
      if (!postoSelecionado) {
        alert("Por favor, selecione um Eletroposto");
        return;
      }

      const posto = postosUnicos.find((p) => p.UndId === postoSelecionado);
      const qtd = contagem[postoSelecionado] || 0;

      // Irá salvar no LocalStorage
      localStorage.setItem(
        "eletropostoSelecionado",
        JSON.stringify({
          UndId: postoSelecionado,
          PostoRecarga: posto?.PostoRecarga ?? "",
          Contagem: qtd,
        })
      );
      router.push("/abastecimento");
    } catch (error) {
      console.log("Erro no login:", error);
    }
  };

  // Irá salvar o eletroposto que o usuário escolher
  useEffect(() => {
    async function fetchConsorciadas() {
      try {
        const res = await fetch(`/api/eletroposto`);
        if (!res.ok) {
          throw new Error("Erro ao buscar consorciadas");
        }
        const data: Eletroposto[] = await res.json();

        // Vai calcular a contagem e criar uma lista única
        const counts: Record<number, number> = {};
        const map = new Map<number, Eletroposto>();

        data.forEach((item) => {
          const id = item.UndId;
          counts[id] = (counts[id] || 0) + 1;
          // salva a primeira ocorrência para usar o nome no select
          if (!map.has(id)) map.set(id, item);
        });

        setPostosUnicos(Array.from(map.values()));
        setContagem(counts);
      } catch (error) {
        console.error("Erro:", error);
      }
    }

    fetchConsorciadas();
  }, [baseUrl]);

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

        <div className="flex flex-col items-start justify-center">
          <Label className="text-lg font-bold mb-3">Eletroposto?</Label>
          <Select onValueChange={(value) => setPostoSelecionado(Number(value))}>
            <SelectTrigger className="bg-gray-100 h-12 w-64 mb-10">
              <SelectValue placeholder="Eletropostos" />
            </SelectTrigger>
            <SelectContent>
              {postosUnicos.map((ele) => (
                <SelectItem key={ele.UndId} value={String(ele.UndId)}>
                  {ele.PostoRecarga}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
