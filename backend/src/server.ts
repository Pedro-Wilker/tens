import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";
import { router } from "./routes";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import https from "https";
import http from "http";
import multer from "multer";
import multerConfig from "./config/multer";
import cookieParser from "cookie-parser"; 
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

const app = express();
const prisma = new PrismaClient();

const isProduction = process.env.NODE_ENV === "production";
const uploadDir = process.env.UPLOAD_DIR || (isProduction
  ? "/home5/tenso3105817/public_html/uploads"
  : path.resolve(__dirname, "..", "uploads"));

app.use(express.json());
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(uploadDir, {
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".svg") res.setHeader("Content-Type", "image/svg+xml");
      else if (ext === ".png") res.setHeader("Content-Type", "image/png");
      else if (ext === ".jpg" || ext === ".jpeg") res.setHeader("Content-Type", "image/jpeg");
      else if (ext === ".webp") res.setHeader("Content-Type", "image/webp");
    },
    fallthrough: true,
  })
);

const upload = multer(multerConfig.upload());
app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
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

app.use(cors(corsOptions));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Requisição recebida: ${req.method} ${req.url} de ${req.headers.origin}`);
  next();
});

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Erro no servidor: ${err.message}`, err.stack);
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ status: "error", message: "Internal server error." });
});

prisma
  .$connect()
  .then(() => {
    fs.appendFileSync("output.log", `Prisma conectado em ${new Date().toISOString()}\n`);
    console.log("Prisma conectado com sucesso!");
  })
  .catch((error) => {
    fs.appendFileSync("error.log", `Erro ao conectar ao Prisma: ${error.message} em ${new Date().toISOString()}\n`);
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

      const privateKey = fs.readFileSync(privateKeyPath, "utf8");
      const cert = fs.readFileSync(certPath, "utf8");
      const ca = fs.readFileSync(caPath, "utf8");

      const credentials = { key: privateKey, cert, ca };
      const httpsServer = https.createServer(credentials, app);
      httpsServer.listen(PORT, () => {
        console.log(`Servidor HTTPS rodando na porta ${PORT}!`);
      });
    } else {
      console.log("Ambiente de desenvolvimento detectado. Iniciando servidor HTTP...");
      const httpServer = http.createServer(app);
      httpServer.listen(PORT, () => {
        console.log(`Servidor HTTP rodando em http://localhost:${PORT}!`);
      });
    }
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", (err as Error).message);
    console.error("Stack trace:", (err as Error).stack);
    fs.appendFileSync("error.log", `Erro ao iniciar o servidor: ${(err as Error).message} em ${new Date().toISOString()}\n`);
    process.exit(1);
  }
}

export default app;