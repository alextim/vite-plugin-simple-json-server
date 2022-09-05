import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';
import { sendData, send400, send404, send415 } from '../../../../../helpers/send';

import { BodyParseError, parseBody } from '../../helpers/parse-body';
import { isJson } from '../../helpers/is-json';

/**
 *
 * PUT   /resource/{id}
 * PATCH /resource/{id}
 *
 */
export const onPutPatch = async (res: ServerResponse, filePath: string, logger: ILogger, id: number, method: 'PUT' | 'PATCH') => {
  const table = new JsonTable(filePath);

  await table.load();

  if (!table.isTable()) {
    return send404(res, ['Not array', filePath], logger);
  }

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

  if (!(await table.update(id, item, method === 'PUT'))) {
    return send404(res, [`id=${id}`, filePath], logger);
  }

  return sendData(res, item, [`resource with id=${item.id} ${method === 'PUT' ? 'replaced' : 'patched'}`, filePath], logger);
};
