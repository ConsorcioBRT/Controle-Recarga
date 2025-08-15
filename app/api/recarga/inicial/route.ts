import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const consorciadas = await prisma.rcg.findMany({
      select: {
        RcgId: true,
        RcgIdOrg: true,
        EmpId: true,
        DtaOpe: true,
        UndId: true,
        VclId: true,
        CrrId: true,
        CrrCnc: true,
        DtaIni: true,
        DtaFin: true,
        SocIni: true,
        SocFin: true,
        RcgKwh: true,
        OdoIni: true,
        OdoFin: true,
        SttRcgId: true,
        FlhId: true,
        FlhDsc: true,
        SttId: true,
        UsrIdAlt: true,
        MtvDel: true,
      },
    });
    return NextResponse.json(consorciadas);
  } catch (error) {
    console.error("Erro ao buscar Recargas:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      UndId,
      VclId,
      CrrId,
      CrrCnc,
      DtaIni,
      DtaOpe,
      SocIni,
      OdoFin,
      UsrIdAlt,
      RcgIdOrg, // pegando do front
      EmpId, // pegando do front
    } = await request.json();

    // Validação simples
    if (
      UndId === undefined ||
      UndId === null ||
      VclId === undefined ||
      VclId === null ||
      CrrId === undefined ||
      CrrId === null ||
      CrrCnc === undefined ||
      CrrCnc === null ||
      DtaIni === undefined ||
      DtaIni === null ||
      DtaOpe === undefined ||
      DtaOpe === null ||
      SocIni === undefined ||
      SocIni === null ||
      OdoFin === undefined ||
      OdoFin === null ||
      UsrIdAlt === undefined ||
      UsrIdAlt === null ||
      RcgIdOrg === undefined ||
      RcgIdOrg === null ||
      EmpId === undefined ||
      EmpId === null
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // Cria o registro da recarga inicial
    const novaRecarga = await prisma.rcg.create({
      data: {
        UndId: Number(UndId),
        VclId: Number(VclId),
        CrrId: Number(CrrId),
        CrrCnc: Number(CrrCnc),
        DtaIni: new Date(DtaIni),
        DtaOpe: new Date(DtaOpe),
        SocIni: Number(SocIni),
        OdoIni: Number(OdoFin),
        UsrIdAlt: Number(UsrIdAlt),
        RcgIdOrg: Number(RcgIdOrg),
        EmpId: Number(EmpId),
        SttRcgId: 5,
        SttId: 1,
      },
    });

    return NextResponse.json(novaRecarga);
  } catch (error) {
    console.error("Erro ao criar recarga inicial:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar recarga inicial" },
      { status: 500 }
    );
  }
}
