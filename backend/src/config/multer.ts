import crypto from "crypto";
import multer, { StorageEngine } from "multer";
import { extname, resolve } from "path";
import fs from "fs";

interface MulterConfig {
  upload(): multer.Options;
}

const isProduction = process.env.NODE_ENV === "production";
const uploadPath = isProduction
  ? "/home5/tenso3105817/public_html/uploads"
  : resolve(process.cwd(), "uploads");

const multerConfig: MulterConfig = {
  upload() {
    const folder = process.env.UPLOAD_DIR || uploadPath;

    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`Diretório ${folder} criado com sucesso.`);
      } catch (err) {
        console.error(`Erro ao criar diretório ${folder}:`, err);
        throw new Error(`Não foi possível criar o diretório ${folder}: ${(err as Error).message}`);
      }
    }

    try {
      fs.accessSync(folder, fs.constants.W_OK);
      console.log(`Permissão de escrita confirmada em ${folder}.`);
    } catch (err) {
      console.error(`Sem permissão de escrita em ${folder}:`, err);
      throw new Error(`Sem permissão de escrita em ${folder}: ${(err as Error).message}`);
    }

    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const fileHash = crypto.randomBytes(8).toString("hex");
          const timestamp = Date.now();
          const fileName = `${timestamp}-${fileHash}-${file.originalname.replace(/\s+/g, "-")}`;
          cb(null, fileName);
        },
      }) as StorageEngine,
      limits: {
        fileSize: 20 * 1024 * 1024, 
        files: 10,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|webp/;
        const extnameCheck = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimetypeCheck = allowedTypes.test(file.mimetype);

        if (extnameCheck && mimetypeCheck) {
          cb(null, true);
        } else {
          cb(new Error("Apenas JPEG, JPG, PNG, SVG e WEBP são permitidos."));
        }
      },
    };
  },
};

export default multerConfig;