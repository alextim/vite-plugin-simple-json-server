import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';
import { sendData, send404, send405 } from '../../../../../helpers/send';

export const onDelete = async (res: ServerResponse, filePath: string, logger: ILogger, id: number) => {
  const table = new JsonTable(filePath);

  if (!(await table.load())) {
    return send405(res, ['Not array', filePath], logger);
  }

  if (!(await table.delete(id))) {
    return send404(res, [`id=${id}`, filePath], logger);
  }

  return sendData(res, '', [`entry with id=${id} deleted`, filePath], logger, 204);
};
