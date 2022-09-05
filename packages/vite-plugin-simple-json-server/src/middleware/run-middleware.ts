import { Connect } from 'vite';
import http from 'node:http';
import AntPathMatcher from '@howiefh/ant-path-matcher';

import { removeTrailingSlash } from '@/utils/misc';
import { ILogger } from '@/services/logger';

import { send404, send405 } from '@/helpers/send';

import { SimpleJsonServerPluginOptions } from '../types';

import { handleHtml } from './handlers/handle-html';
import { handleJson } from './handlers/handle-json';
import { handleOther } from './handlers/handle-other';

const isOurApi = (url: string | undefined, urlPrefixes: string[] | undefined) =>
  url && urlPrefixes && urlPrefixes.some((prefix) => url.startsWith(prefix));

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
  { urlPrefixes, handlers, limit, noHandlerResponse404 }: SimpleJsonServerPluginOptions,
  logger: ILogger,
) => {
  if (!isOurApi(req?.url, urlPrefixes)) {
    return false;
  }
  const urlPath = removeTrailingSlash(req!.url!.split('?')[0]);

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

  const purePath = removePrefix(urlPath, urlPrefixes!);
  if (purePath) {
    if (await handleJson(req, res, mockRoot, purePath, logger, urlPath, limit!)) {
      return true;
    }
    if (handleHtml(req, res, staticRoot, purePath, logger)) {
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
