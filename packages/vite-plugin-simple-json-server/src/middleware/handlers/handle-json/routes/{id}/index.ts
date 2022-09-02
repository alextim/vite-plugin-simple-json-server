import { Connect } from 'vite';
import { ServerResponse } from 'node:http';

import { ILogger } from '../../../../../services/logger';
import { send405 } from '../../../../../helpers/send';

import { onDelete } from './delete';
import { onPutPatch } from './put-patch';
import { onGet } from './get';

export const onID = async (req: Connect.IncomingMessage, res: ServerResponse, logger: ILogger, filePath: string, idParam: string) => {
  const id = parseInt(idParam);
  switch (req.method) {
    case 'DELETE':
      return await onDelete(res, filePath, logger, id);
    case 'PUT':
    case 'PATCH':
      return await onPutPatch(res, filePath, logger, id, req.method);
    case 'GET':
      return await onGet(res, filePath, logger, id);
    default:
      return send405(res, [`Received: ${req.method}`, filePath], logger);
  }
};
