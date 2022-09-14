import querystring from 'node:querystring';
import { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { ILogger } from '../../../../../services/logger';
import { JSON_MIME_TYPE } from '../../../../../utils/mime-types';
import { JsonTable } from '../../../../../services/json-table/json-table';

import { send404, sendFileContent, sendData } from '../../../../../helpers/send';

import { getLinks } from '../../helpers/link-header';
import { getParams } from '../../helpers/get-params';
import { modifyHeader } from '../../helpers/modify-header';
import { getFullUrl } from '../../helpers/get-full-url';

/**
 *
 * GET /resource
 *
 */
export async function onGetAll(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  logger: ILogger,
  filePath: string,
  urlPath: string,
  defaultLimit: number,
) {
  const [, qs] = req.url!.split('?');

  if (!qs) {
    return sendFileContent(res, filePath, JSON_MIME_TYPE, logger);
  }

  const msgMatched = [filePath];

  const table = new JsonTable(filePath);

  await table.load();

  if (!table.isTable()) {
    return sendData(res, table.rawContent, msgMatched, logger);
  }

  const q = querystring.parse(qs);

  const { offset, limit, sortParams, filterParams } = getParams(q, defaultLimit);

  // GET /resource/?prop1={value1}&prop2={value2}...
  if (filterParams) {
    table.filter(filterParams);
    if (table.count() === 0) {
      return send404(res, [`q=${querystring.stringify(q)}`, filePath], logger);
    }
  }

  // GET /resource/?order={prop1,prop2...}
  if (sortParams) {
    table.sort(sortParams);
  }

  // GET /resource/?offset={value1}&limit={value2}
  if (offset !== undefined && limit !== undefined) {
    const totalCount = table.count();

    table.slice(offset, offset + limit);

    delete q.offset;
    const qs = querystring.stringify(q);
    const template = `<${getFullUrl(req, urlPath)}?${qs}&offset=%d>;rel="%s"`;

    const links = getLinks(template, offset, limit, totalCount);

    res.setHeader('X-Total-Count', totalCount);
    modifyHeader(res, 'Link', links);
    modifyHeader(res, 'Access-Control-Expose-Headers', 'X-Total-Count,Link');
  }

  return sendData(res, table.serialize(), msgMatched, logger);
}
