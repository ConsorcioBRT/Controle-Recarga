import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

// aqui é a api que vai buscar se o checklist do eletroposto já foi respondido ou não
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      UndId,
      DtaOpe,
      TrnId,
      PsqId,
      PsqTpoId,
      PsqPrgId,
      PsqRsp,
      PsqDth,
      SttId,
      UsrIdAlt,
      DtaAlt,
    } = body;

    if (UndId === undefined || UndId === null) {
      return new NextResponse("UndId não informado", { status: 400 });
    }

    //Aqui vai criar um registro marcador - para identificar se já respondeu o checklist ou não
    const created = await prisma.psq_rsp.create({
      data: {
        UndId: Number(UndId),
        DtaOpe: new Date(DtaOpe),
        TrnId: Number(TrnId),
        PsqId: PsqId || 1,
        PsqTpoId: PsqTpoId || 1,
        PsqPrgId: PsqPrgId || 999,
        PsqRsp: PsqRsp ?? 0,
        PsqDth: PsqDth || "Checklist Iniciado",
        SttId: SttId || 5,
        UsrIdAlt,
        DtaAlt: DtaAlt ? new Date(DtaAlt) : new Date(),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Erro ao iniciar checklist:", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
