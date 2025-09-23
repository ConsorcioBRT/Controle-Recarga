import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/src/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const consorciadas = await prisma.usr.findMany({
      select: {
        UsrId: true,
        UsrNme: true,
        UsrLgn: true,
        UsrCpf: true,
        UsrEml: true,
        UsrTpoId: true,
      },
      orderBy: {
        UsrNme: "asc",
      },
    });
    return NextResponse.json(consorciadas);
  } catch (error) {
    console.error("Erro ao buscar Usuários:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}

// Aqui será o POST - Usando a criptografia
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret";

// Converte string "YYYY-MM-DD HH:mm:ss" para Date local
function parseDataBrasilia(str: string): Date {
  const [datePart, timePart] = str.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

// Ajusta Data da Operação: 00h-04h → dia anterior
function ajustarDtaOpe(dta: Date): Date {
  const novaData = new Date(dta);
  const hora = novaData.getHours();
  if (hora >= 0 && hora < 5) {
    novaData.setDate(novaData.getDate() - 1);
  }
  return novaData;
}

export async function POST(request: NextRequest) {
  try {
    const { usuario, senha, UndId, DtaOpe, TrnId } = await request.json();

    // Aqui vai procurar o usuário pelo nome, e-mail ou CPF
    const user = await prisma.usr.findFirst({
      where: {
        OR: [{ UsrEml: usuario }, { UsrCpf: usuario }, { UsrLgn: usuario }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { messagem: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    // Aqui vai resetar a senha quando o SttId = 8
    if (user.SttId === 8) {
      return NextResponse.json(
        {
          message: "Usuário precisa resetar a senha.",
          resetRequired: true,
          userId: user.UsrId,
        },
        { status: 200 }
      );
    }

    // Aqui vai comparar a senha criptografada
    const senhaValida = await bcrypt.compare(senha, user.UsrPwd);
    if (!senhaValida) {
      return NextResponse.json(
        { messagem: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    // Aqui não vai enviar a senha no front
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { UsrPwd, ...userSemSenha } = user;

    // Aqui vai verificar se já respondeu o checklist do eletroposto
    console.log("Usuario ID:", user.UsrId);
    console.log("UndId selecionado:", UndId);

    // Verifica se o usuário já respondeu o checklist do eletroposto
    let jaRespondeu = false;
    if (DtaOpe && TrnId) {
      const dtaOpeConvertida = parseDataBrasilia(DtaOpe);
      const dtaOpeCorrigida = ajustarDtaOpe(dtaOpeConvertida);

      const inicioDia = new Date(dtaOpeCorrigida);
      inicioDia.setHours(0, 0, 0, 0);

      const fimDia = new Date(dtaOpeCorrigida);
      fimDia.setHours(23, 59, 59, 999);

      const resposta = await prisma.psq_rsp.findFirst({
        where: {
          UndId: Number(UndId),
          TrnId: Number(TrnId),
          DtaOpe: {
            gte: inicioDia,
            lte: fimDia,
          },
        },
      });
      console.log("Resposta encontrada:", resposta);
      console.log({
        UndId: Number(UndId),
        TrnId: Number(TrnId),
        DtaOpeOriginal: DtaOpe,
        DtaOpeConvertida: new Date(DtaOpe),
      });
      jaRespondeu = !!resposta;
    }

    if (!UndId) {
      return new NextResponse("UndId não informado", { status: 400 });
    }

    // Gera o Token por 15min
    const accessToken = jwt.sign(
      {
        id: user.UsrId,
        email: user.UsrEml,
        role: user.UsrTpoId,
      },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      user: userSemSenha,
      jaRespondeu: !!jaRespondeu,
    });

    // Irá salvar os tokens nos cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30, // 30min (é sempre considerado em segundos)
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro no login" }, { status: 500 });
  }
}
