import { Prisma } from "@/src/lib/generated/prisma";
import prisma from "@/src/lib/prisma";
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

// Aqui vai ser para a Data da Operação ser sempre o dia anterior quando for 00h até 4:59h
function ajustarDtaOpe(dtaIni: Date, dtaOpep: Date) {
  const hora = dtaIni.getHours();
  if (hora >= 0 && hora < 5) {
    dtaOpep.setDate(dtaOpep.getDate() - 1);
  }
  return dtaOpep;
}

// Aqui será o POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { UndId, VclId, CrrId, CrrCnc, SocIni, OdoFin, UsrIdAlt, EmpId } =
      body;

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

    // Aqui se a última recarga terminar com erro, usar ele como origem
    let rcgIdOrgNovo = 0;
    let dtaOpeNovo = new Date();
    if (ultimaRecarga) {
      if (ultimaRecarga.SttRcgId === 7 && ultimaRecarga.FlhId === 1) {
        rcgIdOrgNovo = ultimaRecarga.RcgIdOrg || ultimaRecarga.RcgId; // aqui irá salvar o RcgIdOrg atual com o RcgIdOrg anterior
        dtaOpeNovo = ultimaRecarga.DtaOpe;
      }
    }

    // Aqui vai ajustar o horário das 00h até 5h
    const agora = new Date();
    dtaOpeNovo = ajustarDtaOpe(agora, dtaOpeNovo);

    // Aqui será a criação da Nova Recarga
    const novaRecarga = await prisma.rcg.create({
      data: {
        UndId: Number(UndId),
        VclId: Number(VclId),
        CrrId: Number(CrrId),
        CrrCnc: Number(CrrCnc),
        DtaIni: agora,
        DtaOpe: dtaOpeNovo,
        SocIni: Number(SocIni),
        OdoIni: ultimaRecarga?.OdoFin
          ? new Prisma.Decimal(Number(ultimaRecarga.OdoFin).toFixed(1))
          : null, // se não houver anterior, fica null
        OdoFin:
          OdoFin !== undefined
            ? new Prisma.Decimal(Number(OdoFin).toFixed(1))
            : null,
        UsrIdAlt: Number(UsrIdAlt),
        RcgIdOrg: rcgIdOrgNovo || null,
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

    const {
      RcgId,
      DtaFin,
      SocFin,
      RcgKwh,
      OdoFin,
      FlhId,
      FlhDsc,
      forcarSttRcgId6,
    } = body;

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

    type DadosAtualizadosType = {
      DtaFin?: Date;
      SocFin?: number;
      RcgKwh?: Prisma.Decimal;
      OdoFin?: Prisma.Decimal;
      FlhDsc?: string;
      SttRcgId?: number;
      FlhId?: number;
      RcgIdOrg?: number;
    };

    const dadosAtualizados: DadosAtualizadosType = {};

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
      (!recargaExistente.RcgKwh || recargaExistente.RcgKwh.toNumber() === 0)
    ) {
      dadosAtualizados.RcgKwh = new Prisma.Decimal(Number(RcgKwh).toFixed(3));
    }

    if (
      OdoFin !== undefined &&
      (!recargaExistente.OdoFin || recargaExistente.OdoFin.toNumber() === 0)
    ) {
      dadosAtualizados.OdoFin = new Prisma.Decimal(Number(OdoFin).toFixed(1));
    }

    if (FlhDsc && !recargaExistente.FlhDsc) {
      dadosAtualizados.FlhDsc = FlhDsc;
    }

    if (forcarSttRcgId6) {
      dadosAtualizados.SttRcgId = 6; // aqui vai atualiazr normalmente sem erro
      dadosAtualizados.FlhId = FlhId || 0;
      if (!recargaExistente.RcgIdOrg) {
        dadosAtualizados.RcgIdOrg = recargaExistente.RcgId;
      }
    } else if (FlhId === 1) {
      // finalizada com erro
      dadosAtualizados.FlhId = 1;
      dadosAtualizados.SttRcgId = 7;
      dadosAtualizados.RcgIdOrg =
        recargaExistente.RcgIdOrg || recargaExistente.RcgId; // aqui vai salvar o RcgId no RcgIdOrg
    } else if (recargaExistente.SttRcgId === 5) {
      // finalizada normalmente
      dadosAtualizados.FlhId = 0;
      dadosAtualizados.SttRcgId = 6;
    } else if (!recargaExistente.RcgIdOrg) {
      dadosAtualizados.RcgIdOrg = recargaExistente.RcgId;
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
