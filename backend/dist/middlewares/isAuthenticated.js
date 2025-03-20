"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization;
    const sessionCookie = req.cookies.session;
    let token;
    if (authToken) {
        const [, bearerToken] = authToken.split(" ");
        token = bearerToken;
        console.log("Token obtido do header Authorization:", token);
    }
    else if (sessionCookie) {
        token = sessionCookie;
        console.log("Token obtido do cookie session:", token);
    }
    else {
        console.log("Nenhum token encontrado (nem Authorization nem cookie)");
        return res.status(401).json({ error: "Sessão ou token não encontrados" });
    }
    try {
        const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        req.user_id = sub;
        return next();
    }
    catch (err) {
        console.error("Erro ao verificar token:", err);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}
exports.isAuthenticated = isAuthenticated;
