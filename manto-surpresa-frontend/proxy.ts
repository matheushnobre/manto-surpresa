import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas protegidas que exigem usuário autenticado
const protectedRoutes = ["/tracking"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("auth_token")?.value;

    // Se não houver token no cookie, redireciona para a página de verificação de código
    if (!token) {
      const loginUrl = new URL("/code_verification", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/tracking", "/tracking/:path*"],
};
