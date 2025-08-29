import { NextRequest, NextResponse } from "next/server";

export const TOKEN_KEY = "token";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;

  const protectedRoutes = [
    "/abastecimento",
    "/checklist",
    "/historico",
    "/terminal",
  ];

  // verifica se a rota acessada começa com alguma protegida
  const isProtectedRoute = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/abastecimento/:path*",
    "/checklist/:path*",
    "/historico/:path*",
    "/terminal/:path*",
  ],
};
