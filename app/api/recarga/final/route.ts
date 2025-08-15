import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const {
      RcgId, // ID da recarga que você quer atualizar
      DtaFin,
      SocFin,
      RcgKwh,
      OdoFin,
      FlhId,
      FlhDsc,
    } = await request.json();

    if (!RcgId) {
      return NextResponse.json(
        { error: "RcgId é obrigatório" },
        { status: 400 }
      );
    }

    // Busca a recarga existente
    const recargaExistente = await prisma.rcg.findUnique({
      where: { RcgId: Number(RcgId) },
    });

    if (!recargaExistente) {
      return NextResponse.json(
        { error: "Recarga não encontrada" },
        { status: 404 }
      );
    }

    // Atualiza apenas os campos que estavam nulos ou zero
    const dadosAtualizados: Partial<Prisma.rcgUpdateInput> = {};

    if (recargaExistente.DtaFin === null && DtaFin)
      dadosAtualizados.DtaFin = new Date(DtaFin);
    if (
      (recargaExistente.SocFin === null || recargaExistente.SocFin === 0) &&
      SocFin
    )
      dadosAtualizados.SocFin = Number(SocFin);
    if (
      (recargaExistente.RcgKwh === null || recargaExistente.RcgKwh === 0) &&
      RcgKwh
    )
      dadosAtualizados.RcgKwh = Number(RcgKwh);

    // Aqui vai atualizar o OdoFin se caso ele não estiver preenchido no POST
    if (
      (recargaExistente.OdoFin === null || recargaExistente.OdoFin === 0) &&
      OdoFin
    ) {
      dadosAtualizados.OdoFin = Number(OdoFin);
    }
    if (
      (recargaExistente.FlhId === null || recargaExistente.FlhId === 0) &&
      FlhId
    )
      dadosAtualizados.FlhId = Number(FlhId);
    if (
      (recargaExistente.FlhDsc === null || recargaExistente.FlhDsc === "") &&
      FlhDsc
    )
      dadosAtualizados.FlhDsc = FlhDsc;

    let criarNovaRecarga = false;

    // Aqui vai ser a regra de quando der Problema
    if (FlhId === 1) {
      dadosAtualizados.SttRcgId = 7;
      dadosAtualizados.RcgIdOrg = recargaExistente.RcgId;
      criarNovaRecarga = true;
    } else if (recargaExistente.SttRcgId === 5) {
      // Aqui é pra se caso estiver iniciando, finaliza
      dadosAtualizados.SttRcgId = 6;
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      return NextResponse.json(
        { message: "Nenhum campo para atualizar" },
        { status: 400 }
      );
    }

    const recargaAtualizada = await prisma.rcg.update({
      where: { RcgId: Number(RcgId) },
      data: dadosAtualizados,
    });

    // Aqui vai ser quando precisar criar uma nova Recarga (quando houver problema)
    if (criarNovaRecarga) {
      await prisma.rcg.create({
        data: {
          UndId: recargaExistente.UndId,
          VclId: recargaExistente.VclId,
          EmpId: recargaExistente.EmpId,
          DtaOpe: recargaExistente.DtaOpe,
          DtaIni: new Date(), // início da nova recarga
          OdoIni: recargaAtualizada.OdoFin || recargaExistente.OdoFin || recargaExistente.OdoIni,
          UsrIdAlt: recargaExistente.UsrIdAlt,
          RcgIdOrg: recargaExistente.RcgId,
          SttRcgId: 5, // iniciando
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
