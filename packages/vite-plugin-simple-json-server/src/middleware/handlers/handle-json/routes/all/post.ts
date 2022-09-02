import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';

import { sendData, send400, send405, send409, send415 } from '../../../../../helpers/send';

import { BodyParseError, parseBody } from '../../helpers/parse-body';
import { isJson } from '../../helpers/is-json';

export const onPost = async (res: ServerResponse, filePath: string, logger: ILogger) => {
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

  if (!(await table.load())) {
    return send405(res, ['Not array', filePath], logger);
  }

  if (!(await table.push(item))) {
    return send409(res, [`item with id=${item.id} already exists`, filePath], logger);
  }

  res.setHeader('Location', `${res.req.url}/${item.id}`);
  return sendData(res, item, [`item with id=${item.id} created`, filePath], logger, 201);
};
