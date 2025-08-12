import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const {
      RcgId,
      SocFin,
      OdoFin,
      DtaFin,
      UsrIdAlt,
      SttRcgId = 6, // exemplo: 1 = Livre
      SttId = 1,
    } = await request.json();

    // Validação simples
    if (
      RcgId === undefined ||
      RcgId === null ||
      SocFin === undefined ||
      SocFin === null ||
      OdoFin === undefined ||
      OdoFin === null ||
      DtaFin === undefined ||
      DtaFin === null ||
      UsrIdAlt === undefined ||
      UsrIdAlt === null
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // Atualiza a recarga para finalizar
    const recargaAtualizada = await prisma.rcg.update({
      where: { RcgId: Number(RcgId) },
      data: {
        SocFin: Number(SocFin),
        OdoFin: Number(OdoFin),
        DtaFin: new Date(DtaFin),
        UsrIdAlt: Number(UsrIdAlt),
        SttRcgId: Number(SttRcgId), // Status final (ex: Livre)
        SttId: Number(SttId),
      },
    });

    return NextResponse.json(recargaAtualizada);
  } catch (error) {
    console.error("Erro ao finalizar recarga:", error);
    return NextResponse.json(
      { error: "Erro interno ao finalizar recarga" },
      { status: 500 }
    );
  }
}
