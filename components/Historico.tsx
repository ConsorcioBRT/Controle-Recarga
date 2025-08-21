import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Footer from "./Footer";
import { Separator } from "./ui/separator";

const Historico = () => {
  const falhas = [
    {
      onibus: "1012",
      status: "Recarga Rápida",
      data: "10/08/2026",
      descricao:
        "Falha ao tentar recarregar durante a rota 32B. Sistema reiniciou automaticamente após 5 minutos.",
      operador: "Flávio Augusto",
      hora: "00:45",
    },
    {
      onibus: "1015",
      status: "Bateria Fraca",
      data: "12/08/2026",
      descricao:
        "O sistema identificou falha crítica no módulo de bateria. Ônibus precisou retornar à garagem.",
      operador: "José Augusto",
      hora: "10:05",
    },
    {
      onibus: "1021",
      status: "GPS Desativado",
      data: "13/08/2026",
      descricao:
        "O GPS do ônibus parou de funcionar após perda de sinal em área urbana.",
      operador: "Maria Clara",
      hora: "05:07",
    },
    {
      onibus: "1009",
      status: "Sistema Travado",
      data: "14/08/2026",
      descricao:
        "Interface do painel congelou durante o trajeto. Reinicialização forçada pelo motorista.",
      operador: "Carlos Eduardo",
      hora: "08:56",
    },
    {
      onibus: "1018",
      status: "Conexão Perdida",
      data: "15/08/2026",
      descricao:
        "O sistema perdeu conexão com o servidor central por mais de 10 minutos.",
      operador: "Aline Souza",
      hora: "14:23",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="flex items-center justify-center mt-10 mb-10">
          <h1 className="text-2xl">Histórico de Recargas</h1>
        </div>
        {/* Histórico de Recargas */}
        <div className="mt-5 mx-8">
          <Table>
            <TableCaption>Lista de Recargas recentes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ônibus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {falhas.map((falha, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <TableRow>
                      <TableCell className="text-xs">{falha.onibus}</TableCell>
                      <TableCell className="text-xs">{falha.status}</TableCell>
                      <TableCell className="text-xs">{falha.data}</TableCell>
                      <TableCell className="text-xs">{falha.hora}</TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm w-full rounded-xl p-6">
                    <DialogHeader>
                      <DialogTitle>
                        Resumo da Falha - Ônibus {falha.onibus}
                        <Separator className="mt-2" />
                      </DialogTitle>

                      <div className="flex flex-col items-start gap-3">
                        <div className="flex items-center gap-10 mt-3">
                          <h1 className="bg-white  p-2 rounded-lg">
                            <strong>Data:</strong> {falha.data}
                          </h1>
                          <h1 className="bg-white  p-2 rounded-lg">
                            <strong>Hora:</strong> {falha.hora}
                          </h1>
                        </div>
                        <h1 className="bg-white  p-2 rounded-lg">
                          <strong>Status:</strong> {falha.status}
                        </h1>
                        <h1 className="bg-white  p-2 rounded-lg">
                          <strong>Operador:</strong> {falha.operador}
                        </h1>
                        <h1 className="bg-white  p-2 rounded-lg text-justify">
                          <strong>Descrição:</strong> {falha.descricao}
                        </h1>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer className="fixed bottom-0 w-full" />
    </div>
  );
};

export default Historico;
