import { ServerResponse } from 'node:http';

import { Connect } from 'vite';

import { ILogger } from '../../../services/logger';

import { send404, send405, sendOptions } from '../../../helpers/send';

import { parsePathname } from './helpers/parse-pathname';

import { onPost } from './routes/all/post';
import { onHeadAll } from './routes/all/head';
import { onGetAll } from './routes/all/get';
import { onPutPatchAll } from './routes/all/put-patch';
import { onDelete } from './routes/{id}/delete';
import { onPutPatch } from './routes/{id}/put-patch';
import { onGet } from './routes/{id}/get';
import { JsonDb } from '@/services/json-table';

export async function handleJson(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  mockRoot: string,
  purePath: string,
  logger: ILogger,
  urlPath: string,
  defaultLimit: number,
) {
  const parsed = parsePathname(mockRoot, purePath);
  if (!parsed) {
    return false;
  }
  const { idParam, filePath } = parsed;

  /**
   *  Singular
   *  Route: /resource/{id}
   */
  if (idParam) {
    const id = parseInt(idParam);
    switch (req.method) {
      case 'OPTIONS': {
        const db = new JsonDb(filePath);
        await db.load();
        const methods = ['GET', 'PUT', 'PATCH'];
        if (db.isTable()) {
          methods.push('DELETE');
        }
        return sendOptions(res, methods, [filePath], logger);
      }
      case 'GET':
        return await onGet(res, filePath, logger, id);
      case 'PUT':
      case 'PATCH':
        return await onPutPatch(res, filePath, logger, id, req.method);
      case 'DELETE':
        return await onDelete(res, filePath, logger, id);
      case 'POST': {
        const db = new JsonDb(filePath);
        await db.load();
        if (!db.isTable()) {
          return send404(res, ['', filePath], logger);
        }
      }
      default:
        return send405(res, ['', filePath], logger);
    }
  }

  /**
   *  Plural
   *  Route: /resource/*
   */
  switch (req.method) {
    case 'OPTIONS':
      const db = new JsonDb(filePath);
      await db.load();
      const methods = ['GET', 'POST'];
      if (!db.isTable()) {
        methods.push('PUT', 'PATCH');
      }
      return sendOptions(res, methods, [filePath], logger);
    case 'HEAD':
      return await onHeadAll(req, res, logger, filePath, defaultLimit);
    case 'GET':
      return await onGetAll(req, res, logger, filePath, urlPath, defaultLimit);
    case 'PUT':
    case 'PATCH':
      return await onPutPatchAll(res, filePath, logger, req.method);
    case 'POST':
      return await onPost(res, filePath, logger);
    default:
      return send405(res, ['', filePath], logger);
  }
}
