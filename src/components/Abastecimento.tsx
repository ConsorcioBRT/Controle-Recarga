"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import Footer from "./Footer";
import { Circle, Zap } from "lucide-react";
import DialogStepsCarregando from "./DialogStepsCarregando";
import DialogSteps from "./DialogSteps";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type Veiculo = { Onibus: string; RcgId?: number; FlhId?: number };
type FormRecargaFinal = {
  percentualFinal: string;
  odometro: string;
  energia: string;
  houveFalha: string;
  descricaoFalha?: string;
  forcarSttRcgId6?: boolean;
  DtaFin?: string;
};

const Abastecimento = () => {
  const [livres, setLivres] = useState<{ Onibus: string }[]>([]);
  const [carregando, setCarregando] = useState<Veiculo[]>([]);
  const [odometro] = useState<{ [key: string]: string }>({});
  const [percentualFinal] = useState<{ [key: string]: string }>({});
  const [energia] = useState<{ [key: string]: string }>({});
  const [postoSelecionado] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const eletro = localStorage.getItem("eletropostoSelecionado");
      return eletro ? JSON.parse(eletro).UndId : null;
    }
    return null;
  });
  const [todosVeiculos, setTodosVeiculos] = useState<
    { Onibus: string; UndId: number }[]
  >([]);
  const [selecionados, setSelecionados] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  useEffect(() => {
    let isFirstLoad = true;
    async function fetchVeiculos() {
      if (isFirstLoad) setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/veiculos`);
        if (!res.ok) throw new Error("Erro ao buscar veículos");
        const data = await res.json();

        // Lista completa para o Select
        const livresTodos = data.filter(
          (item: { Situacao: string }) => item.Situacao === "LIVRE"
        );
        setTodosVeiculos(livresTodos);

        // Filtra os veículos pelo eletroposto selecionado
        const livresFiltrados = data.filter(
          (item: { Situacao: string; UndId: number }) =>
            item.Situacao === "LIVRE" &&
            (!postoSelecionado || item.UndId === postoSelecionado)
        );

        const carregandoFiltrados = data.filter(
          (item: { Situacao: string; UndId: number }) =>
            item.Situacao === "INICIADA" &&
            (!postoSelecionado || item.UndId === postoSelecionado)
        );

        setLivres(livresFiltrados);
        setCarregando(carregandoFiltrados);
      } catch (error) {
        console.error(error);
      } finally {
        if (isFirstLoad) setLoading(false);
        isFirstLoad = false;
      }
    }

    fetchVeiculos();
    const interval = setInterval(fetchVeiculos, 2000); // a cada 2s
    return () => clearInterval(interval);
  }, [baseUrl, postoSelecionado]);

  // Irá salvar o veículo no localStorage
  function selecionarVeiculo(veiculo: Veiculo) {
    localStorage.setItem("veiculoSelecionado", JSON.stringify(veiculo));

    // Se caso o veículo não estiver no grid do Dialog, vai adiconar
    setSelecionados((prev) => {
      const existe = prev.find((v) => v.Onibus === veiculo.Onibus);
      if (existe) return prev;
      return [...prev, veiculo];
    });
  }

  // Aqui vai iniciar o Carregamento
  function iniciarCarregamento(veiculo: Veiculo) {
    setLivres((prev) => prev.filter((v) => v.Onibus !== veiculo.Onibus));
    setCarregando((prev) => [...prev, veiculo]);
  }

  // Adapter para DialogStepsCarregando
  function finalizarRecargaAdapter(item: Veiculo, dados: FormRecargaFinal) {
    handleSubmit(
      { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>,
      item,
      dados
    );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    onibusItem: Veiculo,
    dados?: FormRecargaFinal
  ) {
    e.preventDefault();
    console.log("Submit chamado para ônibus:", onibusItem.Onibus);

    if (!onibusItem.RcgId) {
      alert("RcgId não encontrado para esse ônibus");
      return;
    }

    try {
      const response = await fetch("/api/recarga", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RcgId: onibusItem.RcgId,
          DtaFin: dados?.DtaFin ?? new Date().toISOString(),
          SocFin: dados?.percentualFinal
            ? Number(dados.percentualFinal)
            : percentualFinal[onibusItem.Onibus]
            ? Number(percentualFinal[onibusItem.Onibus])
            : null,
          RcgKwh: dados?.energia
            ? Number(dados.energia)
            : energia[onibusItem.Onibus]
            ? Number(energia[onibusItem.Onibus])
            : null,
          OdoFin: dados?.odometro
            ? Number(dados.odometro.replace(/\./g, ""))
            : odometro[onibusItem.Onibus]
            ? Number(odometro[onibusItem.Onibus].replace(/\./g, ""))
            : null,
          FlhId: dados?.houveFalha === "sim" ? 1 : 0,
          FlhDsc: dados?.descricaoFalha ?? null,
          //SttRcgId: 6,
          SttId: 1,
          UsrIdAlt: 123,
          forcarSttRcgId6: Boolean(dados?.forcarSttRcgId6),
        }),
      });

      const result = await response.json();

      // Recarga principal atualizada
      const recargaAtualizada =
        result.novaRecargaCriada || result.recargaAtualizada;

      // Nova recarga em caso de falha
      const novaRecarga = result.novaRecarga || null;

      // Atualiza lista de carregando
      setCarregando((prev) =>
        prev
          .map((v) => (v.Onibus === onibusItem.Onibus ? recargaAtualizada : v))
          .concat(novaRecarga ? [novaRecarga] : [])
      );

      setLivres((prev) => (!novaRecarga ? [...prev, onibusItem] : prev));

      toast.success("Recarga finalizada com sucesso!", {
        duration: 6000,
        className: "text-lg mb-20",
      });
    } catch (error) {
      console.error("Erro no HandleSubmit:", error);
      toast.error("Erro ao finalizar recarga");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <Header />
        {/* Corpo da Página */}
        <div className="mt-5 mx-5">
          {/* Onibus Livres */}
          <div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 text-blue-500 bg-blue-500 rounded-full" />
              <span className="text-base font-semibold text-gray-700">
                Ônibus Livres ({livres.length})
              </span>
              <Select
                onValueChange={(value) => {
                  const onibusSelecionado = todosVeiculos.find(
                    (v) => v.Onibus === value
                  );
                  if (onibusSelecionado) {
                    selecionarVeiculo(onibusSelecionado);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o Ônibus" />
                </SelectTrigger>
                <SelectContent>
                  {todosVeiculos.map((item) => (
                    <SelectItem key={item.Onibus} value={item.Onibus}>
                      {item.Onibus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 ml-1">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : livres.length === 0 && selecionados.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  Nenhum ônibus carregado recentemente
                </p>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-2 gap-1 mt-5">
                  {[...livres, ...selecionados]
                    .filter(
                      (l, idx, self) =>
                        !carregando.find((c) => c.Onibus === l.Onibus) &&
                        self.findIndex((x) => x.Onibus === l.Onibus) == idx // não fica com duplicidade
                    )
                    .map((item) => (
                      <Dialog key={item.Onibus}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              selecionarVeiculo(item);
                            }}
                            variant="outline"
                            className="inline-flex items-center justify-center rounded-xl text-lg font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-10 w-18 bg-blue-500 text-white"
                          >
                            {item.Onibus}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm w-full rounded-xl p-6 bg-gray-100">
                          <DialogHeader className="flex items-start">
                            <DialogTitle className="flex items-center gap-2">
                              <Zap className="text-blue-500" />
                              Iniciar Recarga - Ônibus{" "}
                              <span className="bg-blue-500 text-white p-1 rounded-full">
                                {item.Onibus}
                              </span>
                            </DialogTitle>
                          </DialogHeader>

                          {/* Parte das STEPS */}
                          <DialogSteps
                            veiculo={item}
                            iniciarCarregamento={iniciarCarregamento}
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                </div>
              )}
            </div>
            <Separator className="mt-5" />
          </div>

          {/* Onibus Carregando */}
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 text-green-500 bg-green-500 rounded-full" />
              <span className="text-base font-semibold text-gray-700">
                Ônibus Carregando ({carregando.length})
              </span>
            </div>
            <div className="mt-3 ml-1">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : carregando.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  Nenhum ônibus carregando
                </p>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-2 gap-1 mt-5">
                  {carregando.map((item, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            selecionarVeiculo(item);
                          }}
                          variant="outline"
                          className="inline-flex items-center justify-center rounded-xl text-lg font-semibold transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl h-10 w-18 bg-green-500 text-white"
                        >
                          {item.Onibus}
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-sm w-full rounded-xl p-6 bg-gray-100">
                        <DialogHeader className="flex items-start">
                          <DialogTitle className="flex items-center gap-2">
                            <Zap className="text-green-500" />
                            Finalizar Recarga - Ônibus{" "}
                            <span className="bg-green-500 text-white p-1 rounded-full">
                              {item.Onibus}
                            </span>
                          </DialogTitle>
                        </DialogHeader>

                        <DialogStepsCarregando
                          item={item}
                          finalizarRecarga={finalizarRecargaAdapter}
                          reiniciarRecarga={item.FlhId === 1}
                        />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botão de Fazer CheckList */}
          <div className="mt-20 flex items-center justify-center">
            <Button>Você possui um checklist para responder!</Button>
          </div>
        </div>
      </main>
      <Footer className="fixed bottom-0 w-full" />
    </div>
  );
};

export default Abastecimento;
