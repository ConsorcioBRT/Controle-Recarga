import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checklist = await prisma.vwChecklistCarregamento.findMany({
      select: {
        PsqTpoId: true,
        Tipo_Pesquisa: true,
        PsqPrgId: true,
        Pergunta: true,
        Sequencia: true,
      },
      orderBy: {
        PsqPrgId: "asc",
      },
    });
    return NextResponse.json(checklist);
  } catch (error) {
    console.error("Erro ao buscar Lista de Check:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
