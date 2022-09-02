import type { ServerResponse } from 'node:http';
import path from 'node:path';
import { Connect } from 'vite';

import { ILogger } from '@/services/logger';
import { HTML_MIME_TYPE } from '@/utils/mime-types';

import { send403, sendFileContent } from '@/helpers/send';
import getFilepath from '@/helpers/get-filepath';

export function handleHtml(req: Connect.IncomingMessage, res: ServerResponse, dataRoot: string, purePath: string, logger: ILogger) {
  const pathname = path.join(dataRoot, purePath);

  const filePath = getFilepath(pathname, HTML_MIME_TYPE);
  if (!filePath) {
    return false;
  }

  if (req.method !== 'GET') {
    return send403(res, [`Received: ${req.method}`, filePath], logger);
  }
  return sendFileContent(res, filePath, HTML_MIME_TYPE, logger);
}
