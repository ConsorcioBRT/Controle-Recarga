import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Aqui será o GET
export async function GET() {
  try {
    const recargas = await prisma.rcg.findMany({
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
        DtaAlt: true,
        MtvDel: true,
      },
    });
    return NextResponse.json(recargas);
  } catch (error) {
    console.log("Erro ao buscar Recargas:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

// Aqui será o POST
export async function POST(request: Request) {
  try {
    const {
      UndId,
      VclId,
      CrrId,
      CrrCnc,
      SocIni,
      OdoFin,
      UsrIdAlt,
      EmpId,
    } = await request.json();

    if (
      !UndId ||
      !VclId ||
      !CrrId ||
      CrrCnc === undefined ||
      SocIni === undefined ||
      OdoFin === undefined ||
      !UsrIdAlt ||
      !EmpId
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }
    // Aqui vai buscar a última recarga do veículo
    const ultimaRecarga = await prisma.rcg.findFirst({
      where: { VclId: Number(VclId) },
      orderBy: { DtaIni: "desc" },
    });

    // Aqui se a última recarga terminar com erro, usar ele como orgigem
    let rcgIdOrgNovo = 0;
    if (ultimaRecarga && ultimaRecarga.SttRcgId === 7) {
      rcgIdOrgNovo = ultimaRecarga.RcgId;
    }
    // Aqui será a criação da Nova Recarga
    const novaRecarga = await prisma.rcg.create({
      data: {
        UndId: Number(UndId),
        VclId: Number(VclId),
        CrrId: Number(CrrId),
        CrrCnc: Number(CrrCnc),
        DtaIni: new Date(),
        DtaOpe: new Date(),
        SocIni: Number(SocIni),
        OdoIni: ultimaRecarga?.OdoFin || null, // se não houver anterior, fica null
        OdoFin: OdoFin !== undefined ? Number(OdoFin) : null,
        UsrIdAlt: Number(UsrIdAlt),
        RcgIdOrg: rcgIdOrgNovo,
        EmpId: Number(EmpId),
        SttRcgId: 5,
        SttId: 1,
        FlhId: 0,
      },
    });
    return NextResponse.json(novaRecarga);
  } catch (error) {
    console.error("Erro ao criar recarga:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar recarga" },
      { status: 500 }
    );
  }
}

// Aqui será o PUT
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Dados recebidos no PUT:", body);

    const { RcgId, DtaFin, SocFin, RcgKwh, OdoFin, FlhId, FlhDsc } = body;

    if (!RcgId) {
      return NextResponse.json(
        { error: "RcgId é obrigatório" },
        { status: 400 }
      );
    }

    const recargaExistente = await prisma.rcg.findUnique({
      where: { RcgId: Number(RcgId) },
    });
    console.log("Recarga encontrada:", recargaExistente);

    if (!recargaExistente) {
      return NextResponse.json(
        { error: "Recarga não encontrada" },
        { status: 404 }
      );
    }

    const dadosAtualizados: Partial<Prisma.rcgUpdateInput> = {};

    if (DtaFin && !recargaExistente.DtaFin) {
      dadosAtualizados.DtaFin = new Date(DtaFin);
    }

    if (
      SocFin !== undefined &&
      (!recargaExistente.SocFin || recargaExistente.SocFin === 0)
    ) {
      dadosAtualizados.SocFin = Number(SocFin);
    }

    if (
      RcgKwh !== undefined &&
      (!recargaExistente.RcgKwh || recargaExistente.RcgKwh === 0)
    ) {
      dadosAtualizados.RcgKwh = Number(RcgKwh);
    }

    if (
      OdoFin !== undefined &&
      (!recargaExistente.OdoFin || recargaExistente.OdoFin === 0)
    ) {
      dadosAtualizados.OdoFin = Number(OdoFin);
    }

    if (FlhId === 1) {
      // finalizada com erro
      dadosAtualizados.FlhId = 1;
      dadosAtualizados.SttRcgId = 7;
    } else if (recargaExistente.SttRcgId === 5) {
      // finalizada normalmente
      dadosAtualizados.FlhId = 0;
      dadosAtualizados.SttRcgId = 6;
    }

    if (FlhDsc && !recargaExistente.FlhDsc) {
      dadosAtualizados.FlhDsc = FlhDsc;
    }

    const recargaAtualizada = await prisma.rcg.update({
      where: { RcgId: Number(RcgId) },
      data: dadosAtualizados,
    });

    console.log("Recarga atualizada:", recargaAtualizada);
    return NextResponse.json({ recargaAtualizada });
  } catch (error) {
    console.error("Erro ao atualizar recarga:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar recarga" },
      { status: 500 }
    );
  }
}
