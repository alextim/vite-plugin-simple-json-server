import fs from 'node:fs';
import { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { ILogger } from '@/utils/logger';

export function sendFileContent(req: Connect.IncomingMessage, res: ServerResponse, filePath: string, mime: string, logger: ILogger) {
  logger.info('matched', `${req.method} ${req.url}`, `file: ${filePath}`);

  const data = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', mime);
  res.end(data);
}
