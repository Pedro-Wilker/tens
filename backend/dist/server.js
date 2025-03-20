"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const multer_1 = __importDefault(require("multer"));
const multer_2 = __importDefault(require("./config/multer"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv_1.default.config({ path: envFile });
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const isProduction = process.env.NODE_ENV === "production";
const uploadDir = process.env.UPLOAD_DIR || (isProduction
    ? "/home5/tenso3105817/public_html/uploads"
    : path_1.default.resolve(__dirname, "..", "uploads"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/uploads", express_1.default.static(uploadDir, {
    setHeaders: (res, filePath) => {
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (ext === ".svg")
            res.setHeader("Content-Type", "image/svg+xml");
        else if (ext === ".png")
            res.setHeader("Content-Type", "image/png");
        else if (ext === ".jpg" || ext === ".jpeg")
            res.setHeader("Content-Type", "image/jpeg");
        else if (ext === ".webp")
            res.setHeader("Content-Type", "image/webp");
    },
    fallthrough: true,
}));
const upload = (0, multer_1.default)(multer_2.default.upload());
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        console.log("Nenhum arquivo recebido no upload.");
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }
    const fileUrl = `${process.env.FRONTEND_URL}/uploads/${req.file.filename}`;
    console.log(`Arquivo enviado: ${req.file.path}, URL: ${fileUrl}`);
    return res.status(200).json({
        message: "Arquivo enviado com sucesso",
        file: req.file.filename,
        url: fileUrl,
    });
});
//======CORS
const allowedOrigins = [
    "*",
    "http://localhost:3000",
    "https://tensoportunidades.com.br",
    "https://tensoportunidades.com.br:8080",
    "https://tensoportunidades.com.br:443",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
const corsOptions = {
    origin: ['https://tensoportunidades.com.br:8080'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.url} de ${req.headers.origin}`);
    next();
});
app.use(routes_1.router);
app.use((err, req, res, next) => {
    console.error(`Erro no servidor: ${err.message}`, err.stack);
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ status: "error", message: "Internal server error." });
});
prisma
    .$connect()
    .then(() => {
    fs_1.default.appendFileSync("output.log", `Prisma conectado em ${new Date().toISOString()}\n`);
    console.log("Prisma conectado com sucesso!");
})
    .catch((error) => {
    fs_1.default.appendFileSync("error.log", `Erro ao conectar ao Prisma: ${error.message} em ${new Date().toISOString()}\n`);
    console.error("Erro ao conectar ao Prisma:", error);
    process.exit(1);
});
if (require.main === module) {
    try {
        const PORT = parseInt(process.env.PORT || (isProduction ? "8080" : "3333"), 10);
        if (isProduction) {
            console.log("Ambiente de produção detectado. Iniciando servidor HTTPS...");
            const sslDir = process.env.SSL_DIR || "/home5/tenso3105817/ssl";
            const privateKeyPath = process.env.PRIVATE_KEY_PATH || `${sslDir}/privkey.pem`;
            const certPath = process.env.CERT_PATH || `${sslDir}/cert.pem`;
            const caPath = process.env.CA_PATH || `${sslDir}/cabundle.pem`;
            const privateKey = fs_1.default.readFileSync(privateKeyPath, "utf8");
            const cert = fs_1.default.readFileSync(certPath, "utf8");
            const ca = fs_1.default.readFileSync(caPath, "utf8");
            const credentials = { key: privateKey, cert, ca };
            const httpsServer = https_1.default.createServer(credentials, app);
            httpsServer.listen(PORT, () => {
                console.log(`Servidor HTTPS rodando na porta ${PORT}!`);
            });
        }
        else {
            console.log("Ambiente de desenvolvimento detectado. Iniciando servidor HTTP...");
            const httpServer = http_1.default.createServer(app);
            httpServer.listen(PORT, () => {
                console.log(`Servidor HTTP rodando em http://localhost:${PORT}!`);
            });
        }
    }
    catch (err) {
        console.error("Erro ao iniciar o servidor:", err.message);
        console.error("Stack trace:", err.stack);
        fs_1.default.appendFileSync("error.log", `Erro ao iniciar o servidor: ${err.message} em ${new Date().toISOString()}\n`);
        process.exit(1);
    }
}
exports.default = app;
