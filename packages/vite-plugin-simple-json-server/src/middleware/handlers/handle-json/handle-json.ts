import { ServerResponse } from 'node:http';

import { Connect } from 'vite';

import { ILogger } from '../../../services/logger';

import { send405 } from '../../../helpers/send';

import { parsePathname } from './helpers/parse-pathname';

import { onID } from './routes/{id}';
import { onPost } from './routes/all/post';
import { onGetAll } from './routes/all/get-all';

export async function handleJson(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  dataRoot: string,
  purePath: string,
  logger: ILogger,
  urlPath: string,
  defaultLimit: number,
) {
  const parsed = parsePathname(dataRoot, purePath);
  if (!parsed) {
    return false;
  }
  const { idParam, filePath } = parsed;

  /**
   *  Route: /{resource-name}/:id
   *  Methods: GET, PUT, PATCH, DELETE
   */
  if (idParam) {
    return await onID(req, res, logger, filePath, idParam);
  }

  /**
   *  Route: /{resource-name}/*
   *  Method: POST
   */
  if (req.method === 'POST') {
    return await onPost(res, filePath, logger);
  }

  if (req.method !== 'GET') {
    return send405(res, [`Received: ${req.method}`, filePath], logger);
  }

  /**
   *  Route: /{resource-name}/*
   *  Method: GET
   */
  return await onGetAll(req, res, logger, filePath, urlPath, defaultLimit);
}
