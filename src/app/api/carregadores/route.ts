import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Aqui vai pegar o UndId da query striing (?undId=x)
    const { searchParams } = new URL(request.url);
    const cbtId = searchParams.get("cbtId");
    const undId = searchParams.get("undId");

    if (!cbtId || !undId) {
      return new NextResponse("Parâmetro CbtId e UndId são obrigatórios", {
        status: 400,
      });
    }

    // Aqui vai buscar todos os carregadores com o mesmo UndId
    const carregadores = await prisma.vwCarregador.findMany({
      where: { CbtId: Number(cbtId), UndId: Number(undId) },
      select: {
        UndId: true,
        Unidade: true,
        CbtId: true,
        TipoCombustivel: true,
        EqpItmId: true,
        Carregador: true,
      },
      orderBy: {
        Carregador: "asc",
      },
    });

    return NextResponse.json(carregadores);
  } catch (error) {
    console.error("Erro ao buscar Usuários:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
