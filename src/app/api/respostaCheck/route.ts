import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

// Irei buscar todas as respostas dos CheckLists
export async function GET() {
  try {
    const respostasCheck = await prisma.psq_rsp.findMany({
      select: {
        PsqId: true,
        PsqTpoId: true,
        PsqPrgId: true,
        PsqRspId: true,
        PsqRsp: true,
        SttId: true,
        UsrIdAlt: true,
        DtaAlt: true,
      },
      orderBy: {
        PsqPrgId: "asc",
      },
    });
    return NextResponse.json(respostasCheck);
  } catch (error) {
    console.error("Erro ao buscar respostas", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}

// Irei criar as respostas dos CheckLists
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      PsqId,
      PsqTpoId,
      PsqPrgId,
      PsqRspId,
      PsqRsp,
      SttId,
      UsrIdAlt,
      DtaAlt,
    } = body;

    const resposta = await prisma.psq_rsp.create({
      data: {
        PsqId,
        PsqTpoId,
        PsqPrgId,
        PsqRspId,
        PsqRsp,
        SttId,
        UsrIdAlt,
        DtaAlt,
      },
    });

    return NextResponse.json(resposta, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
