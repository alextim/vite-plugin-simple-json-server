import fs from 'node:fs';
import { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { ILogger } from '../utils/logger';
import { JSON_MIME_TYPE } from '../utils/mime-types';

export function sendFileContent(req: Connect.IncomingMessage, res: ServerResponse, filePath: string, mime: string, logger: ILogger) {
  logger.info('matched', `${req.method} ${req.url}`, `file: ${filePath}`);

  const data = fs.readFileSync(filePath, 'utf-8');

  res.setHeader('Content-Type', mime);
  res.statusCode = 200;
  res.end(data);
  return true;
}

export function notFound(res: ServerResponse, message: string, logger: ILogger) {
  logger.info(message);

  res.setHeader('Content-Type', JSON_MIME_TYPE);
  res.statusCode = 404;
  res.end(JSON.stringify({ message }));
  return true;
}

export function sendJson(res: ServerResponse, data: any, message: string[], logger: ILogger, statusCode = 200) {
  logger.info(...message);

  res.setHeader('Content-Type', JSON_MIME_TYPE);
  res.statusCode = statusCode;
  res.end(typeof data === 'string' ? data : JSON.stringify(data));
  return true;
}
