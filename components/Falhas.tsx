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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Falhas = () => {
  const falhas = [
    {
      onibus: "1012",
      status: "Recarga Rápida",
      data: "10/08/2026",
      descricao:
        "Falha ao tentar recarregar durante a rota 32B. Sistema reiniciou automaticamente após 5 minutos.",
      operador: "Flávio Augusto",
    },
    {
      onibus: "1015",
      status: "Bateria Fraca",
      data: "12/08/2026",
      descricao:
        "O sistema identificou falha crítica no módulo de bateria. Ônibus precisou retornar à garagem.",
      operador: "José Augusto",
    },
    {
      onibus: "1021",
      status: "GPS Desativado",
      data: "13/08/2026",
      descricao:
        "O GPS do ônibus parou de funcionar após perda de sinal em área urbana.",
      operador: "Maria Clara",
    },
    {
      onibus: "1009",
      status: "Sistema Travado",
      data: "14/08/2026",
      descricao:
        "Interface do painel congelou durante o trajeto. Reinicialização forçada pelo motorista.",
      operador: "Carlos Eduardo",
    },
    {
      onibus: "1018",
      status: "Conexão Perdida",
      data: "15/08/2026",
      descricao:
        "O sistema perdeu conexão com o servidor central por mais de 10 minutos.",
      operador: "Aline Souza",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-center mt-10 mb-10">
        <h1 className="text-2xl">Relatório de Falhas</h1>
      </div>
      {/* Histórico de Falhas */}
      <div className="mt-5 mx-8">
        <Table>
          <TableCaption>Lista de Falhas recentes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ônibus</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {falhas.map((falha, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <TableRow>
                    <TableCell>{falha.onibus}</TableCell>
                    <TableCell>{falha.status}</TableCell>
                    <TableCell>{falha.data}</TableCell>
                  </TableRow>
                </DialogTrigger>
                <DialogContent className="max-w-sm w-full rounded-xl p-6">
                  <DialogHeader>
                    <DialogTitle>
                      Resumo da Falha - Ônibus {falha.onibus}
                    </DialogTitle>

                    <div className="flex flex-col items-start gap-3">
                      <h1 className="bg-white shadow-lg p-2 rounded-lg mt-4
                      ">
                        <strong>Data:</strong> {falha.data}
                      </h1>
                      <h1 className="bg-white shadow-lg p-2 rounded-lg">
                        <strong>Status:</strong> {falha.status}
                      </h1>
                      <h1 className="bg-white shadow-lg p-2 rounded-lg">
                        <strong>Operador:</strong> {falha.operador}
                      </h1>
                      <h1 className="bg-white shadow-lg p-2 rounded-lg text-justify">
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
    </div>
  );
};

export default Falhas;
