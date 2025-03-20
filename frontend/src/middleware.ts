import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/services/api";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/_next", "/", "/session/sign", "/session/signup", "/login"];
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const privateRoutes = ["/dashboard", "/create-service", "/userdetail"];
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute) {
    const cookieStore = await cookies();
    const sessionCookies = cookieStore.getAll().filter((c) => c.name === "session");

    if (sessionCookies.length === 0) {
      console.log(`Acesso negado: Token não encontrado para a rota ${pathname}`);
      return NextResponse.redirect(new URL("/session/sign", req.url));
    }

    let token: string;
    if (sessionCookies.length > 1) {
      const latestCookie = sessionCookies[sessionCookies.length - 1];
      sessionCookies.slice(0, -1).forEach((oldCookie) => {
        cookieStore.delete(oldCookie.name);
        console.log(`Token antigo removido no middleware: ${oldCookie.value}`);
      });
      token = latestCookie.value;
    } else {
      token = sessionCookies[0].value;
    }

    const isValid = await validateToken(token);

    if (!isValid) {
      console.log(`Acesso negado: Token inválido para a rota ${pathname}`);
      return NextResponse.redirect(new URL("/session/sign", req.url));
    }

    console.log(`Acesso permitido: Token válido para a rota ${pathname}`);
    return NextResponse.next();
  }

  return NextResponse.next();
}

async function validateToken(token: string): Promise<boolean> {
  if (!token || typeof token !== "string" || token.length < 10) {
    console.log("Token inválido: Formato ou tamanho incorreto");
    return false;
  }

  try {
    
    await api.get("/detailuser"); 
    return true;
  } catch (err) {
    console.error("Erro na validação do token:", (err as any).message);
    return false;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/create-service/:path*", "/userdetail/:path*"],
};