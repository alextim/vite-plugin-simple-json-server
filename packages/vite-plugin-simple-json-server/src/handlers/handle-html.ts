import type { ServerResponse } from 'node:http';
import path from 'node:path';
import { Connect } from 'vite';

import { SimpleJsonServerPluginOptions } from '../types';

import { ILogger } from '../utils/logger';
import { HTML_MIME_TYPE } from '../utils/mime-types';

import { validateReq } from '../helpers/validate-request';
import { sendFileContent } from '../helpers/send-file-content';
import checkPathname from '../helpers/check-pathname';

export function handleHtml(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  viteRoot: string,
  urlPath: string,
  options: SimpleJsonServerPluginOptions,
  logger: ILogger,
) {
  const pathname = path.join(viteRoot, options.mockRootDir!, urlPath);

  const filePath = checkPathname(pathname, HTML_MIME_TYPE);
  if (!filePath) {
    return false;
  }

  if (validateReq(req, res)) {
    sendFileContent(req, res, filePath, HTML_MIME_TYPE, logger);
  }
  return true;
}
