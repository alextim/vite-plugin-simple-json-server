import path from 'node:path';
import fs from 'node:fs';
import querystring from 'node:querystring';

import type { ServerResponse } from 'node:http';

import { isDirExists, isFileExists, sendFileContent } from './utils';
import { Connect } from 'vite';
import { ILogger } from './logger';
import { validateReq } from './validate-request';
import { fileTypes } from './constants';

export function handleJson(req: Connect.IncomingMessage, res: ServerResponse, testingPath: string, logger: ILogger) {
  const name = isDirExists(testingPath) ? 'index' : '';
  const ext = 'json';

  const filePath = (name ? path.join(testingPath, name) : testingPath) + '.' + ext;
  if (!isFileExists(filePath)) {
    return false;
  }
  if (!validateReq(req, res, 405, ['POST'])) {
    return true;
  }

  const a = req.url!.split('?');
  if (a.length === 1 || !a[1]) {
    sendFileContent(res, filePath, fileTypes.json, logger);
    return true;
  }

  const q = querystring.parse(a[1]);

  const content = fs.readFileSync(filePath, 'utf-8');

  let page = 0;
  let limit = 0;
  let sort = '';
  let order = 'asc';
  if (q['_page']) {
    page = Math.max(1, parseInt(q['_page'] as string));
  }
  if (q['_limit']) {
    limit = Math.max(0, parseInt(q['_limit'] as string));
    if (limit === 0) {
      limit = 10;
    }
  }
  if (q['_sort']) {
    sort = q['_sort'] as string;
  }

  if (q['_order']) {
    order = q['_order'] as string;
    if (order !== 'asc' && order !== 'desc') {
      order = 'asc';
    }
  }

  logger.info('matched', `file: ${filePath}`);
  res.setHeader('Content-Type', fileTypes.json);

  if (!page && !limit && !sort) {
    res.end(content);
    return true;
  }

  let data = JSON.parse(content);
  if (!Array.isArray(data) || data.length === 0) {
    res.end(content);
    return true;
  }

  if (page || limit) {
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    data = data.slice(start, end);
  }
  if (sort && data[0].hasOwnProperty(sort)) {
    const dir = order === 'asc' ? 1 : -1;
    data = data.sort((a: any, b: any) => {
      if (a[sort] > b[sort]) {
        return 1 * dir;
      }
      if (a[sort] < b[sort]) {
        return -1 * dir;
      }
      return 0;
    });
  }
  res.end(JSON.stringify(data));

  return true;
}
