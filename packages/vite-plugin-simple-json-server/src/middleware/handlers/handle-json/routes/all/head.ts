import querystring from 'node:querystring';
import { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';

import { send405, sendHeader } from '../../../../../helpers/send';

import { getParams } from '../../helpers/get-params';

/**
 *
 * HEAD /resource
 *
 */
export async function onHeadAll(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  logger: ILogger,
  filePath: string,
  defaultLimit: number,
) {
  const [, qs] = req.url!.split('?');

  const table = new JsonTable(filePath);

  await table.load();

  if (!table.isTable()) {
    return send405(res, ['', filePath], logger);
  }

  const q = querystring.parse(qs);

  const { filterParams } = getParams(q, defaultLimit);

  const count = table.count(filterParams);
  return sendHeader(
    res,
    {
      'X-Total-Count': count,
      'Access-Control-Expose-Headers': 'X-Total-Count',
    },
    [filePath],
    logger,
  );
}
