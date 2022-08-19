import path from 'node:path';

import type { ServerResponse } from 'node:http';

import { isFileExists, sendFileContent } from './utils';
import { Connect } from 'vite';
import { ILogger } from './logger';
import { validateReq } from './validate-request';
import { FileType, fileTypes } from './constants';

export function handleOther(req: Connect.IncomingMessage, res: ServerResponse, testingPath: string, logger: ILogger) {
  if (!isFileExists(testingPath)) {
    return false;
  }
  const { ext } = path.parse(testingPath);
  const key = ext.substring(1) as FileType;
  if (!fileTypes[key]) {
    return false;
  }
  if (validateReq(req, res)) {
    sendFileContent(res, testingPath, fileTypes[key], logger);
  }
  return true;
}
