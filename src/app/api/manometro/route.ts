import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Manometro, Temperatura, UsrId, MomentoRegistro } = body;

    if (
      Manometro === undefined ||
      Manometro === null ||
      !UsrId ||
      !MomentoRegistro
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: Manometro, UsrId, MomentoRegistro" },
        { status: 400 },
      );
    }

    const agora = new Date();
    const saoPaulo = new Date(agora.getTime() - 3 * 60 * 60 * 1000);

    const registro = await prisma.bioposto_afericao.create({
      data: {
        MomentoRegistro: String(MomentoRegistro),
        DtaHra: saoPaulo,
        Manometro: Number(Manometro),
        Temperatura: Number(Temperatura ?? 0),
        UsrId: Number(UsrId),
      },
    });

    return NextResponse.json(registro, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar aferição do manômetro:", error);
    return NextResponse.json(
      { error: "Erro interno ao salvar aferição" },
      { status: 500 },
    );
  }
}
