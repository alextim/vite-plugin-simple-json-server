import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';

import { sendData, send404 } from '../../../../../helpers/send';

/**
 *
 * GET /resource/{id}
 *
 */
export const onGet = async (res: ServerResponse, filePath: string, logger: ILogger, id: number) => {
  const table = new JsonTable(filePath);

  await table.load();

  if (!table.isTable()) {
    return send404(res, ['Not array', filePath], logger);
  }

  const item = table.getById(id);
  if (!item) {
    return send404(res, [`id=${id}`, filePath], logger);
  }

  return sendData(res, item, [`id=${id} found`, filePath], logger);
};
