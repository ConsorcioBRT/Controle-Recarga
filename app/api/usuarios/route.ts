import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const consorciadas = await prisma.usr.findMany({
      select: {
        UsrNme: true,
        UsrCpf: true,
        UsrEml: true,
        UsrId: true,
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
export async function POST(request: NextRequest) {
  try {
    const { usuario, senha } = await request.json();

    // Aqui vai procurar o usuário pelo nome, e-mail ou CPF
    const user = await prisma.usr.findFirst({
      where: {
        OR: [{ UsrEml: usuario }, { UsrCpf: usuario }, { UsrNme: usuario }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { messagem: "Usuário não encontrado." },
        { status: 401 }
      );
    }

    // Aqui vai comparar a senha criptografada
    const senhaValida = await bcrypt.compare(senha, user.UsrPwd);
    if (!senhaValida) {
      return NextResponse.json(
        { messagem: "Senha incorreta." },
        { status: 401 }
      );
    }

    // Aqui não vai enviar a senha no front
    const { UsrPwd, ...userComSenha } = user;

    return NextResponse.json(userComSenha);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro no login" }, { status: 500 });
  }
}
