import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const consorciadas = await prisma.usr.findMany({
      select: {
        UsrNme: true,
        UsrCpf: true,
        UsrEml: true,
        UsrId: true,
        UsrTpoId: true,
      },
      orderBy: {
        UsrNme: "asc",
      },
    });
    return NextResponse.json(consorciadas);
  } catch (error) {
    console.error("Erro ao buscar Usuários:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
