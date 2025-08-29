"use server";

import { TOKEN_KEY } from "@/app/middleware";
import { cookies } from "next/headers";

interface LoginData {
  usuario: string;
  senha: string;
}

export async function login(data: LoginData) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: TOKEN_KEY,
    value: "token", // aqui poderia ser um JWT real futuramente
    httpOnly: true, // importante para middleware
    path: "/", // cookie disponível para todas as rotas
    maxAge: 60 * 60 * 24, // opcional, 1 dia
  });

  cookieStore.set({
    name: "user",
    value: data.usuario,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function logout() {
  const cookiesData = await cookies();
  cookiesData.delete(TOKEN_KEY);
  cookiesData.delete("user");
}
