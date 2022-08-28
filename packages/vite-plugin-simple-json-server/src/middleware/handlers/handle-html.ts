import type { ServerResponse } from 'node:http';
import path from 'node:path';
import { Connect } from 'vite';

import { ILogger } from '@/utils/logger';
import { HTML_MIME_TYPE } from '@/utils/mime-types';

import { validateReq } from '@/helpers/validate-request';
import { sendFileContent } from '@/helpers/send';
import getFilepath from '@/helpers/get-filepath';

export function handleHtml(req: Connect.IncomingMessage, res: ServerResponse, dataRoot: string, purePath: string, logger: ILogger) {
  const pathname = path.join(dataRoot, purePath);

  const filePath = getFilepath(pathname, HTML_MIME_TYPE);
  if (!filePath) {
    return false;
  }

  if (validateReq(req, res)) {
    sendFileContent(req, res, filePath, HTML_MIME_TYPE, logger);
  }
  return true;
}
