import path from 'node:path';

import type { ServerResponse } from 'node:http';

import { isDirExists, isFileExists, sendFileContent } from './utils';
import { Connect } from 'vite';
import { ILogger } from './logger';
import { validateReq } from './validate-request';
import { fileTypes } from './constants';

export function handleHtml(req: Connect.IncomingMessage, res: ServerResponse, testingPath: string, logger: ILogger) {
  const name = isDirExists(testingPath) ? 'index' : '';
  const ext = 'html';

  const filePath = (name ? path.join(testingPath, name) : testingPath) + '.' + ext;
  if (!isFileExists(filePath)) {
    return false;
  }

  if (validateReq(req, res)) {
    sendFileContent(res, filePath, fileTypes[ext], logger);
  }
  return true;
}
