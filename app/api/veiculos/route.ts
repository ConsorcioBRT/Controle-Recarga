import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Buscar todos os ônibus da view
    const onibus = await prisma.vwOnibus.findMany({
      select: {
        EqpItmId: true,
        Onibus: true,
        Situacao: true,
      },
      orderBy: { Onibus: "asc" },
    });

    // Buscar as recargas iniciadas para esses ônibus (SttRcgId === 5, por exemplo)
    const recargasIniciadas = await prisma.rcg.findMany({
      where: { SttRcgId: 5 }, // status iniciada
      select: {
        RcgId: true,
        VclId: true,
      },
    });

    // Juntar RcgId na lista de ônibus carregando
    const onibusComRecarga = onibus.map((o) => {
      if (o.Situacao === "INICIADA") {
        const recarga = recargasIniciadas.find((r) => r.VclId === o.EqpItmId);
        return {
          ...o,
          RcgId: recarga ? recarga.RcgId : null,
        };
      }
      return { ...o, RcgId: null };
    });

    return NextResponse.json(onibusComRecarga);
  } catch (error) {
    console.error("Erro ao buscar ônibus:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { RcgId, novoStatus } = body;

    if (!RcgId || novoStatus === undefined) {
      return new NextResponse("Parâmetros inválidos", { status: 400 });
    }

    // Atualizar status na tabela rcg
    const atualizado = await prisma.rcg.update({
      where: { RcgId },
      data: { SttRcgId: novoStatus },
    });

    return NextResponse.json({
      message: "Status atualizado com sucesso",
      atualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
