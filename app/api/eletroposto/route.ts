import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const consorciadas = await prisma.emp_und.findMany({
      select: {
        UndRdz: true,
      },
      orderBy: {
        UndRdz: "asc",
      },
    });
    return NextResponse.json(consorciadas);
  } catch (error) {
    console.error("Erro ao buscar Eletropostos:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
