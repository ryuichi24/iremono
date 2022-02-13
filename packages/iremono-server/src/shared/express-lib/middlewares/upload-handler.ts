import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { createFolderIfNotExists } from '@iremono/util';
import { parseMultipart } from '../../multipart-parser';
import { loggerFactory } from '../../utils/logger';
import { CryptoService } from '@iremono/backend-core/src/services/crypto-service';

const logger = loggerFactory.createLogger('uploadHandler');

export const uploadHandler =
  ({ folderPath, encryptionKey }: { folderPath: string; encryptionKey: string }, cryptoService: CryptoService) =>
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userMediaDir = path.join(folderPath, 'iremono_media', req.user.id);
      const filesDir = path.join(userMediaDir, 'files');
      const thumbnailsDir = path.join(userMediaDir, 'thumbnails');
      await createFolderIfNotExists(filesDir);
      await createFolderIfNotExists(thumbnailsDir);

      const fileDest = path.join(filesDir, crypto.randomUUID());
      const writeStream = fs.createWriteStream(fileDest);

      const fileInitializationVector = cryptoService.generateInitializeVector();
      const cipherStreamForFile = cryptoService.generateCipherStreamInCBC(encryptionKey, fileInitializationVector);

      const { fileName, mimeType, formData } = await parseMultipart(req, req.headers, (file) => {
        file.pipe(cipherStreamForFile).pipe(writeStream);
      });

      req.uploadedFile = {
        fileName,
        mimeType,
        formData,
        filePath: fileDest,
        fileInitializationVector,
        thumbnail: {
          thumbnailPath: '',
          thumbnailSize: '',
          thumbnailInitializationVector: '',
        },
      };
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          error.message,
          `[path="${req.originalUrl}", method="${req.method}", host="${req.hostname}", ip="${req.ip}", message="${error.message}"]`,
        );

        next(new Error(error.message));
      }
    }
  };
