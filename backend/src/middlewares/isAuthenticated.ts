import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization; 
  const sessionCookie = req.cookies.session; 

  let token: string | undefined;

  if (authToken) {
    const [, bearerToken] = authToken.split(" ");
    token = bearerToken;
    console.log("Token obtido do header Authorization:", token);
  } else if (sessionCookie) {
    token = sessionCookie;
    console.log("Token obtido do cookie session:", token);
  } else {
    console.log("Nenhum token encontrado (nem Authorization nem cookie)");
    return res.status(401).json({ error: "Sessão ou token não encontrados" });
  }

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as Payload;
    req.user_id = sub;
    return next();
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}