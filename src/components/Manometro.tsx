"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Gauge } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const Manometro = () => {
  const router = useRouter();
  const [valor, setValor] = useState("");
  const [momento, setMomento] = useState<"Início" | "Final" | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function buscarTemperatura(): Promise<number> {
    try {
      const eletropostoJson = localStorage.getItem("eletropostoSelecionado");
      if (!eletropostoJson) return 0;
      const eletroposto = JSON.parse(eletropostoJson);
      const lat = eletroposto?.Latitude;
      const lon = eletroposto?.Longitude;
      if (!lat || !lon) return 0;

      const res = await fetch(`/api/temperatura?lat=${lat}&lon=${lon}`);
      if (!res.ok) return 0;
      const data = await res.json();
      return typeof data.temperatura === "number"
        ? Math.round(data.temperatura)
        : 0;
    } catch {
      return 0;
    }
  }

  async function handleSubmit() {
    const valorNum = Number(valor);
    if (!momento) {
      setErro("Selecione Início ou Final.");
      return;
    }
    if (!valor.trim() || isNaN(valorNum) || !Number.isInteger(valorNum)) {
      setErro("Informe um valor inteiro válido.");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const usuarioJson = localStorage.getItem("usuarioLogado");
      const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;
      const UsrId = usuario?.UsrId;

      if (!UsrId) {
        setErro("Usuário não encontrado. Faça login novamente.");
        return;
      }

      const temperatura = await buscarTemperatura();

      const res = await fetch("/api/manometro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Manometro: valorNum,
          Temperatura: temperatura,
          UsrId,
          MomentoRegistro: momento,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      setSucesso(true);
      setTimeout(() => router.push("/abastecimento"), 1500);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [valor]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex flex-col items-center justify-center flex-1 px-6 pb-20 pt-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-green-100 p-4 rounded-full">
              <Gauge className="w-10 h-10 text-green-600" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Manômetro</h1>
            <p className="text-sm text-gray-500 text-center">
              Informe a leitura atual do manômetro em bar
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold text-gray-700">
              Momento do Registro
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(["Início", "Final"] as const).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => {
                    setMomento(op);
                    setErro(null);
                  }}
                  className={`h-12 rounded-lg text-base font-semibold border-2 transition-all ${
                    momento === op
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:border-green-400"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-base font-semibold text-gray-700">
              Valor (bar)
            </Label>
            <Input
              type="number"
              inputMode="numeric"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value);
                setErro(null);
              }}
              placeholder="Ex: 200"
              className="h-14 text-xl text-center bg-gray-50 border-gray-300"
              autoFocus
            />
            {erro && <p className="text-red-500 text-sm">{erro}</p>}
          </div>

          {sucesso ? (
            <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-semibold">
              Registrado com sucesso! Redirecionando...
            </div>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !valor.trim() || !momento}
              className="h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Registrar"
              )}
            </Button>
          )}
        </div>
      </main>

      <Footer className="fixed bottom-0 w-full" />
    </div>
  );
};

export default Manometro;
