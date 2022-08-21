import path from 'node:path';
import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { fileTypes } from '../constants';

import { isDirExists, isFileExists } from '../utils/files';
import { ILogger } from '../utils/logger';

import { validateReq } from '../helpers/validate-request';
import { sendFileContent } from '../helpers/send-file-content';

export function handleHtml(req: Connect.IncomingMessage, res: ServerResponse, testingPath: string, logger: ILogger) {
  const name = isDirExists(testingPath) ? 'index' : '';
  const ext = 'html';

  const filePath = (name ? path.join(testingPath, name) : testingPath) + '.' + ext;
  if (!isFileExists(filePath)) {
    return false;
  }

  if (validateReq(req, res)) {
    sendFileContent(req, res, filePath, fileTypes[ext], logger);
  }
  return true;
}
