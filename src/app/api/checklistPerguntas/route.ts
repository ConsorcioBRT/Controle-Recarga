import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const PsqTpoId = Number(searchParams.get("PsqTpoId"));

    if (!PsqTpoId) {
      return new NextResponse("PsqTpoId é obrigatório", { status: 400 });
    }

    const perguntas = await prisma.vwPesquisaPergunta.findMany({
      where: { PsqTpoId },
      select: {
        PsqTpoId: true,
        Tipo_Pesquisa: true,
        PsqPrgId: true,
        Pergunta: true,
        Sequencia: true,
      },
      orderBy: { Sequencia: "asc" }, // melhor que PsqPrgId
    });

    return NextResponse.json(perguntas);
  } catch (error) {
    console.error("Erro ao buscar perguntas por tipo:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
