import path from 'node:path';
import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { SimpleJsonServerPluginOptions } from '../types';

import { isFileExists } from '../utils/files';
import { ILogger } from '../utils/logger';
import getMime from '../utils/mime-types';

import { validateReq } from '../helpers/validate-request';
import { sendFileContent } from '../helpers/send-file-content';

export function handleOther(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  viteRoot: string,
  urlPath: string,
  options: SimpleJsonServerPluginOptions,
  logger: ILogger,
) {
  const pathname = path.join(viteRoot, options.mockRootDir!, urlPath);

  if (!isFileExists(pathname)) {
    return false;
  }
  const ext = path.parse(pathname).ext.substring(1);

  const mime = getMime(ext);
  if (!mime) {
    return false;
  }
  if (validateReq(req, res)) {
    sendFileContent(req, res, pathname, mime, logger);
  }
  return true;
}
