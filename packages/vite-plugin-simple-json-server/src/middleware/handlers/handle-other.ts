import path from 'node:path';
import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { ILogger } from '@/services/logger';
import getMime from '@/utils/mime-types';
import { isFileExists } from '@/utils/files';

import { send403, sendFileContent } from '@/helpers/send';

export function handleOther(req: Connect.IncomingMessage, res: ServerResponse, dataRoot: string, purePath: string, logger: ILogger) {
  const pathname = path.join(dataRoot, purePath);

  if (!isFileExists(pathname)) {
    return false;
  }
  const ext = path.parse(pathname).ext.substring(1);

  const mime = getMime(ext);
  if (!mime) {
    return false;
  }
  if (req.method !== 'GET') {
    return send403(res, [`Received: ${req.method}`, pathname], logger);
  }
  return sendFileContent(res, pathname, mime, logger);
}
