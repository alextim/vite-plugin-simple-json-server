import http from 'node:http';
import { Connect } from 'vite';
import AntPathMatcher from '@howiefh/ant-path-matcher';

import { removeTrailingSlash } from '@/utils/misc';
import { timeout } from '@/utils/timeout';

import { ILogger } from '@/services/logger';
import { send404, send405 } from '@/helpers/send';
import { isOurApi } from '@/helpers/is-our-api';

import { SimpleJsonServerPluginOptions } from '../types';
import { OPEN_API } from '../constants';

import { handleJson, handleOther, handleOpenApiIndex, handleOpenApiJson } from './handlers';

const removePrefix = (url: string, urlPrefixes: string[]) => {
  for (const prefix of urlPrefixes) {
    if (url.startsWith(prefix)) {
      return url.substring(prefix.length);
    }
  }
  return '';
};
// build url matcher
const matcher = new AntPathMatcher();

const runMiddleware = async (
  req: Connect.IncomingMessage,
  res: http.ServerResponse,
  mockRoot: string,
  staticRoot: string,
  options: SimpleJsonServerPluginOptions,
  logger: ILogger,
) => {
  const { urlPrefixes, handlers, limit, noHandlerResponse404, delay } = options;

  if (!isOurApi(req?.url, urlPrefixes)) {
    return false;
  }
  const urlPath = removeTrailingSlash(req!.url!.split('?')[0]);
  const purePath = removePrefix(urlPath, urlPrefixes!) || '/';

  if (matcher.doMatch(`${urlPrefixes![0]}${OPEN_API}.json`, urlPath, true)) {
    return await handleOpenApiJson(req, res, mockRoot, staticRoot, options, logger);
  }
  if (matcher.doMatch(`${urlPrefixes![0]}${OPEN_API}`, urlPath, true)) {
    return handleOpenApiIndex(req, res, urlPath, logger);
  }

  if (delay) {
    let cancelRequest = false;
    req.on('close', () => {
      cancelRequest = true;
    });
    await timeout(delay);
    if (cancelRequest) {
      logger.info(`${res.req.method} ${res.req.url}`, 'cancelled by user');
      return false;
    }
  }

  if (handlers) {
    for (const handler of handlers) {
      const urlVars: Record<string, string> = {};
      if (matcher.doMatch(handler.pattern, urlPath, true, urlVars)) {
        const handlerInfo = [`handler = ${JSON.stringify(handler, null, 2)}`];
        if (Object.keys(urlVars).length) {
          handlerInfo.push(`urlVars = ${JSON.stringify(urlVars, null, 2)}`);
        }
        if (handler.method && handler.method !== req.method) {
          return send405(res, handlerInfo, logger);
        }
        logger.info('matched', ...handlerInfo);
        handler.handle(req, res, { ...urlVars });
        return true;
      }
    }
  }

  if (purePath) {
    if (await handleJson(req, res, mockRoot, purePath, logger, urlPath, limit!)) {
      return true;
    }
    if (handleOther(req, res, staticRoot, purePath, logger)) {
      return true;
    }
  }

  if (noHandlerResponse404) {
    return send404(res, 'No any handler or file route', logger);
  }

  return false;
};

export default runMiddleware;
