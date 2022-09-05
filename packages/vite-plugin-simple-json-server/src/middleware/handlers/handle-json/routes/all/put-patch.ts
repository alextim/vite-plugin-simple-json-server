import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';

import { sendData, send400, send405, send415 } from '../../../../../helpers/send';

import { BodyParseError, parseBody } from '../../helpers/parse-body';
import { isJson } from '../../helpers/is-json';

/**
 *
 * PUT    /resource
 * PATCH  /resource
 *
 */
export const onPutPatchAll = async (res: ServerResponse, filePath: string, logger: ILogger, method: 'PUT' | 'PATCH') => {
  if (!isJson(res.req)) {
    return send415(res, '', logger);
  }

  let item: any;
  try {
    item = await parseBody(res.req);
  } catch (err) {
    if (err instanceof BodyParseError) {
      return send400(res, err.message, logger);
    }
    throw err;
  }

  const table = new JsonTable(filePath);

  await table.load();

  if (table.isTable()) {
    return send405(res, ['', filePath], logger);
  }

  const updated = await table.updateObject(item, method === 'PUT');

  return sendData(res, updated, [`resource ${method === 'PUT' ? 'replaced' : 'patched'}`, filePath], logger, 200);
};
