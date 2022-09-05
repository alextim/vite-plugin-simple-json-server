import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';
import { sendData, send404 } from '../../../../../helpers/send';

/**
 *
 * DELETE /resource/{id}
 *
 */
export const onDelete = async (res: ServerResponse, filePath: string, logger: ILogger, id: number) => {
  const table = new JsonTable(filePath);

  await table.load();

  if (!table.isTable()) {
    return send404(res, ['Not array', filePath], logger);
  }

  if (!(await table.delete(id))) {
    return send404(res, [`id=${id}`, filePath], logger);
  }

  return sendData(res, '{}', [`resource with id=${id} deleted`, filePath], logger, 200);
};
