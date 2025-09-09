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
        PsqDth: true,
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
    const respostas = await request.json();

    if (!Array.isArray(respostas) || respostas.length === 0) {
      return new NextResponse("Nenhuma reposta enviada", { status: 400 });
    }

    const respostasCriadas = [];

    for (const r of respostas) {
      const {
        PsqId,
        PsqTpoId,
        PsqPrgId,
        PsqRsp,
        PsqDth,
        SttId,
        UsrIdAlt,
        DtaAlt,
      } = r;

      if (!PsqPrgId || PsqRsp === null) {
        return new NextResponse("Dados incompletos", { status: 400 });
      }

      const resposta = await prisma.psq_rsp.create({
        data: {
          PsqId: PsqId || 1,
          PsqTpoId: PsqTpoId || 1,
          PsqPrgId,
          PsqRsp,
          PsqDth: PsqDth || "",
          SttId: SttId || 1,
          UsrIdAlt: UsrIdAlt || 123,
          DtaAlt: DtaAlt ? new Date(DtaAlt) : new Date(),
        },
      });
      respostasCriadas.push(resposta);
    }

    return NextResponse.json(respostasCriadas, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
