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
      RcgIdOrg,
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
      RcgIdOrg === undefined ||
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
        RcgIdOrg: RcgIdOrg ? Number(RcgIdOrg) : 0,
        EmpId: Number(EmpId),
        SttRcgId: 5,
        SttId: 1,
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
    const { RcgId, DtaFin, SocFin, RcgKwh, OdoFin, FlhId, FlhDsc } =
      await request.json();

    if (!RcgId) {
      return NextResponse.json(
        { error: "RcgId é obrigatório" },
        { status: 400 }
      );
    }

    const recargaExistente = await prisma.rcg.findUnique({
      where: { RcgId: Number(RcgId) },
    });

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

    if (
      FlhId !== undefined &&
      (!recargaExistente.FlhId || recargaExistente.FlhId === 0)
    ) {
      dadosAtualizados.FlhId = Number(FlhId);
    }

    if (FlhDsc && !recargaExistente.FlhDsc) {
      dadosAtualizados.FlhDsc = FlhDsc;
    }

    let criarNovaRecarga = false;

    if (FlhId === 1) {
      dadosAtualizados.SttRcgId = 7; // aqui vai ser quando der erro
      dadosAtualizados.RcgIdOrg = recargaExistente.RcgId;
      criarNovaRecarga = true;
    } else if (recargaExistente.SttRcgId === 5) {
      dadosAtualizados.SttRcgId = 6; // aqui vai ser pra finalizar normalmente
    }

    const recargaAtualizada = await prisma.rcg.update({
      where: { RcgId: Number(RcgId) },
      data: dadosAtualizados,
    });

    if (criarNovaRecarga) {
      await prisma.rcg.create({
        data: {
          UndId: recargaExistente.UndId,
          VclId: recargaExistente.VclId,
          EmpId: recargaExistente.EmpId,
          DtaOpe: recargaExistente.DtaOpe,
          DtaIni: new Date(),
          OdoIni:
            recargaAtualizada.OdoFin ||
            recargaExistente.OdoFin ||
            recargaExistente.OdoIni,
          UsrIdAlt: recargaExistente.UsrIdAlt,
          RcgIdOrg: recargaExistente.RcgId,
          SttRcgId: 5,
          SttId: 1,
        },
      });
    }
    return NextResponse.json(recargaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar recarga:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar recarga" },
      { status: 500 }
    );
  }
}
