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
export async function POST(request: NextRequest) {
  try {
    const { usuario, senha } = await request.json();

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
