// common/interceptors/upload-file.interceptor.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const sessionsPath = join(process.cwd(), '..', 'Session');

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      if (!existsSync(sessionsPath)) {
        mkdirSync(sessionsPath, { recursive: true });
      }

      callback(null, sessionsPath);
    },

    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${extname(file.originalname)}`;

      callback(null, uniqueName);
    },
  }),
};

export function UploadSingleFile(fieldName = 'file') {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, multerConfig)),
  );
}
