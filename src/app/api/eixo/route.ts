import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const eixos = await prisma.brt.findMany({
      select: {
        BrtId: true,
        BrtNme: true,
      },
      where: {
        SttIdAtu: 1,
      },
      orderBy: {
        BrtNme: "asc",
      },
    });

    return NextResponse.json(eixos);
  } catch (error) {
    console.error("Erro ao buscar eixos:", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
