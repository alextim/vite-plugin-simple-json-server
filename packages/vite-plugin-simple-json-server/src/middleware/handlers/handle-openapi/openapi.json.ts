import type { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { SimpleJsonServerPluginOptions } from '../../../types';

import { ILogger } from '@/services/logger';
import { send403, sendData, sendOptions } from '@/helpers/send';
import { getJson } from './get-json';

export async function handleOpenApiJson(
  req: Connect.IncomingMessage,
  res: ServerResponse,
  mockRoot: string,
  staticRoot: string,
  options: SimpleJsonServerPluginOptions,
  logger: ILogger,
) {
  switch (req.method) {
    case 'OPTIONS':
      return sendOptions(res, ['GET'], ['OpenApi'], logger);
    case 'GET':
      const data = await getJson(mockRoot, staticRoot, options);
      return sendData(res, data, [], logger);
    default:
      return send403(res, [`Received: ${req.method}`], logger);
  }
}
