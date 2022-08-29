import path from 'node:path';
import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { ILogger } from '../../utils/logger';
import getMime from '../../utils/mime-types';

import { validateMethod } from '../../helpers/validate-method';
import { sendFileContent } from '../../helpers/send';
import { isFileExists } from '../../utils/files';

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
  if (validateMethod(req, res)) {
    sendFileContent(req, res, pathname, mime, logger);
  }
  return true;
}
