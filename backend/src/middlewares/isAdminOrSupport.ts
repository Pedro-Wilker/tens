import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string;
  role?: "PROVIDER" | "CLIENT" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
}

export function isAdminOrSupport(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization; // Header Authorization
  const sessionCookie = req.cookies.session; // Cookie 'session'

  let token: string | undefined;

  // Prioriza o header Authorization, se presente
  if (authToken) {
    const [, bearerToken] = authToken.split(" ");
    token = bearerToken;
    console.log("Token obtido do header Authorization:", token);
  } else if (sessionCookie) {
    token = sessionCookie;
    console.log("Token obtido do cookie session:", token);
  } else {
    console.log("Nenhum token encontrado (nem Authorization nem cookie)");
    return res.status(401).json({ error: "Sessão ou token não fornecidos" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    const payload = verify(token, process.env.JWT_SECRET) as Payload;

    if (!payload.role || typeof payload.role !== "string") {
      return res.status(401).json({
        error: "Role não encontrada ou inválida no token",
        message: "O token deve conter uma role válida (ADMIN, SUPPORT, etc.).",
      });
    }

    const role = payload.role;

    if (role === "ADMIN" || role === "SUPPORT") {
      return next();
    } else {
      return res.status(403).json({
        error: "Acesso não autorizado",
        message: "Somente usuários com role ADMIN ou SUPPORT têm permissão.",
      });
    }
  } catch (err) {
    console.error("Erro ao verificar token em isAdminOrSupport:", err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}