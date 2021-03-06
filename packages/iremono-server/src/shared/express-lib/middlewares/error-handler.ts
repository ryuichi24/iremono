import express from 'express';
import { config } from '../../../config';
import { HttpError } from '../../utils/errors/base';

import { HttpStatusCode } from '../../utils/http';

export const errorHandler =
  () => (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    let statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    let errorResponse = { message: error.message, timestamp: new Date().toISOString(), stack: error.stack };

    if (error instanceof HttpError) {
      statusCode = error.StatusCode;
    }

    if (!config.serverConfig.IS_DEVELOPMENT) {
      errorResponse.message = config.serverConfig.PRODUCTION_ERROR_MESSAGE;
      errorResponse.stack = undefined;
    }

    return res.status(statusCode).json({
      error: errorResponse,
    });
  };
