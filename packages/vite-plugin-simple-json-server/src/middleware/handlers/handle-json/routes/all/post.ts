import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { JsonTable } from '../../../../../services/json-table/json-table';

import { sendData, send400, send409, send415 } from '../../../../../helpers/send';

import { BodyParseError, parseBody } from '../../helpers/parse-body';
import { isJson } from '../../helpers/is-json';
import { modifyHeader } from '../../helpers/modify-header';
import { getFullUrl } from '../../helpers/get-full-url';

/**
 *
 * POST  /resource
 *
 */
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

  await table.load();

  let location = getFullUrl(res.req, res.req.url!);
  if (table.isTable()) {
    const success = await table.push(item);
    if (!success) {
      return send409(res, [`resource with id=${item.id} already exists`, filePath], logger);
    }
    location += `/${item.id}`;
  } else {
    await table.updateObject(item, true);
  }

  res.setHeader('Location', location);
  modifyHeader(res, 'Access-Control-Expose-Headers', 'Location');

  return sendData(res, item, [`resource with id=${item.id} created`, filePath], logger, 201);
};
