import fs from 'node:fs';
import { ServerResponse } from 'node:http';

import { ILogger } from '../utils/logger';

export function sendFileContent(res: ServerResponse, filePath: string, mime: string, logger: ILogger) {
  logger.info('matched', `file: ${filePath}`);

  const data = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', mime);
  res.end(data);
}
