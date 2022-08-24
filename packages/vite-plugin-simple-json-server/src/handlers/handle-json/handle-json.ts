import fs from 'node:fs';
import path from 'node:path';
import querystring from 'node:querystring';
import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { ILogger } from '@/utils/logger';
import { JSON_MIME_TYPE } from '@/utils/mime-types';

import { validateReq } from '@/helpers/validate-request';
import { sendFileContent } from '@/helpers/send-file-content';
import formatResMsg from '@/helpers/format-res-msg';
import checkPathname from '@/helpers/check-pathname';

import { filter } from './helpers/filter';
import { getFilteredCount } from './helpers/get-filtered-count';
import { getNames, hasParam } from './helpers/get-names';

const COUNT_API_SUFFIX = '/count';
const isCountApi = (url: string) => url.endsWith(COUNT_API_SUFFIX);
const stripCountSuffix = (url: string) => url.substring(0, url.length - COUNT_API_SUFFIX.length);

export function handleJson(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  dataRoot: string,
  urlPath: string,
  defaultLimit: number,
  logger: ILogger,
) {
  const isCount = isCountApi(urlPath);

  const pathname = path.join(dataRoot, isCount ? stripCountSuffix(urlPath) : urlPath);

  const filePath = checkPathname(pathname, JSON_MIME_TYPE);
  if (!filePath) {
    return false;
  }

  if (!validateReq(req, res, 405, ['GET', 'POST'])) {
    return true;
  }

  const [, qs] = req.url!.split('?');
  if (!isCount && !qs) {
    sendFileContent(req, res, filePath, JSON_MIME_TYPE, logger);
    return true;
  }

  const q = querystring.parse(qs);

  let offset: number | undefined = undefined;
  let limit = 0;
  let sort = '';
  let order = 'asc';

  if (q['offset']) {
    offset = Math.max(0, parseInt(q['offset'] as string));
  }
  if (q['limit']) {
    limit = Math.max(0, parseInt(q['limit'] as string));
    if (limit === 0) {
      limit = defaultLimit;
    }
  }
  if (q['sort']) {
    sort = q['sort'] as string;
  }

  if (q['order']) {
    order = q['order'] as string;
    if (order !== 'asc' && order !== 'desc') {
      order = 'asc';
    }
  }

  res.setHeader('Content-Type', JSON_MIME_TYPE);
  const content = fs.readFileSync(filePath, 'utf-8');

  const msgSuffix = [`${req.method} ${req.url}`, `file: ${filePath}`];
  const msgMatched = ['matched', ...msgSuffix];

  let data = JSON.parse(content);

  if (offset === undefined && !sort && !isCount && Array.isArray(data) && data.length > 0 && getNames(q, data[0]).length === 0) {
    logger.info(...msgMatched);
    res.end(content);
    return true;
  }

  if (!Array.isArray(data) && (offset !== undefined || sort || isCount || hasParam(q))) {
    const msg = ['405 Not Allowed', 'Json is not array'];
    logger.info(...msg, ...msgSuffix);
    res.statusCode = 405;
    res.end(formatResMsg(req, ...msg));
    return true;
  }

  if (isCount) {
    const filteredCount = getFilteredCount(data, q);
    logger.info(...msgMatched);
    res.end(JSON.stringify({ count: filteredCount }));
    return true;
  }

  data = filter(data, q);

  if (data.length > 0) {
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

    if (offset !== undefined) {
      limit = limit ? limit : 10;
      data = data.slice(offset, offset + limit);
    }
  }

  logger.info(...msgMatched);
  res.end(JSON.stringify(data));

  return true;
}
