import fs from 'node:fs';
import path from 'node:path';
import querystring from 'node:querystring';
import http, { ServerResponse } from 'node:http';

import { Connect } from 'vite';

import { ILogger } from '../../../utils/logger';
import { JSON_MIME_TYPE } from '../../../utils/mime-types';
import { sort } from '../../../utils/comp-properties-of';

import { validateMethod } from '../../../helpers/validate-method';
import { notFound, sendFileContent, sendJson } from '../../../helpers/send';
import formatResMsg from '../../../helpers/format-res-msg';
import getFilepath from '../../../helpers/get-filepath';

import { filter } from './helpers/filter';
import { getFilteredCount } from './helpers/get-filtered-count';
import { getParamNames, hasParams } from './helpers/get-param-names';
import { getLink, getTemplate, setLinkHeader } from './helpers/link-header';

export function handleJson(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  dataRoot: string,
  purePath: string,
  logger: ILogger,
  urlPath: string,
  defaultLimit: number,
) {
  let idParam = '';
  let resourceName = purePath;

  let pathname = path.join(dataRoot, purePath);

  let filePath = getFilepath(pathname, JSON_MIME_TYPE);
  if (!filePath) {
    const index = purePath.lastIndexOf('/');
    if (index === -1) {
      return false;
    }
    resourceName = purePath.substring(0, index);
    pathname = path.join(dataRoot, resourceName);
    filePath = getFilepath(pathname, JSON_MIME_TYPE);
    if (!filePath) {
      return false;
    }
    idParam = purePath.substring(index + 1);
  }

  if (!validateMethod(req, res, 405, ['GET'])) {
    return true;
  }

  const [, qs] = req.url!.split('?');

  if (!qs && !idParam) {
    return sendFileContent(req, res, filePath, JSON_MIME_TYPE, logger);
  }

  const q = querystring.parse(qs);

  const isCount = Object.keys(q).some((key) => key === 'count');

  let offset: number | undefined = undefined;
  let limit: number | undefined = undefined;
  const sortParams: string[] = [];

  if (q['offset']) {
    offset = Math.max(0, parseInt(q['offset'] as string));
  }

  if (q['limit']) {
    limit = Math.max(0, parseInt(q['limit'] as string));
  }

  if (offset !== undefined || limit !== undefined) {
    if (offset === undefined) {
      offset = 0;
    }
    if (limit === undefined || limit === 0) {
      limit = defaultLimit;
    }
  }

  if (q['sort']) {
    const parseSortParam = (value: string) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    if (Array.isArray(q['sort'])) {
      sortParams.push(...q['sort'].map(parseSortParam).flat());
    } else {
      sortParams.push(...parseSortParam(q['sort']));
    }
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  const msgSuffix = [`${req.method} ${req.url}`, `file: ${filePath}`];
  const msgMatched = ['matched', ...msgSuffix];

  let data = JSON.parse(content);

  if (
    offset === undefined &&
    limit === undefined &&
    sortParams.length === 0 &&
    !isCount &&
    !idParam &&
    Array.isArray(data) &&
    (data.length === 0 || (data.length > 0 && getParamNames(q).length === 0))
  ) {
    return sendJson(res, content, msgMatched, logger);
  }

  if (
    !Array.isArray(data) &&
    (offset !== undefined || limit !== undefined || sortParams.length > 0 || isCount || idParam || hasParams(q))
  ) {
    const msg = [`405 ${http.STATUS_CODES[405]}`, 'Json is not array'];
    return sendJson(res, { message: formatResMsg(req, ...msg) }, [...msg, ...msgSuffix], logger, 405);
  }

  if (idParam) {
    data = data.filter((item: any) => item.id == idParam);
    if (data.length === 0) {
      return notFound(res, `${resourceName} with id ${idParam} not found`, logger);
    }
    return sendJson(res, data[0], msgMatched, logger);
  }

  if (isCount) {
    const filteredCount = getFilteredCount(data, q);
    return sendJson(res, { count: filteredCount }, msgMatched, logger);
  }

  data = filter(data, q);

  if (data.length === 0) {
    return notFound(res, `${resourceName} with q = ${querystring.stringify(q)} not found`, logger);
  }

  if (sortParams.length > 0) {
    sort(data, ...sortParams);
  }

  if (offset !== undefined && limit !== undefined) {
    const count = data.length;

    data = data.slice(offset, offset + limit);

    const template = getTemplate(req, urlPath, q);
    const link = getLink(template, offset, limit, count);
    setLinkHeader(res, link, count);
  }

  return sendJson(res, data, msgMatched, logger);
}
