import path from 'node:path';
import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import type { FileType } from '../constants';
import { fileTypes } from '../constants';

import { isFileExists } from '../utils/files';
import { ILogger } from '../utils/logger';

import { validateReq } from '../helpers/validate-request';
import { sendFileContent } from '../helpers/send-file-content';

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
