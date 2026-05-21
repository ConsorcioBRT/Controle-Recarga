import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

// Lista os tipos/assuntos do checklist (PsqTpo)
export async function GET() {
  try {
    const tipos = await prisma.psq_tpo.findMany({
      where: { SttId: 1 },
      select: {
        PsqTpoId: true,
        PsqTpo: true,
      },
      orderBy: { PsqTpoId: "asc" },
    });

    return NextResponse.json(tipos);
  } catch (error) {
    console.error("Erro ao buscar tipos (psq_tpo):", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
