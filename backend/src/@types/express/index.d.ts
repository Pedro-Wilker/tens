import { Request } from 'express';
import { File } from 'multer'; 

declare module 'express' {
  export interface Request {
    user_id: string;
    files?: File[] | undefined; 
  }
}