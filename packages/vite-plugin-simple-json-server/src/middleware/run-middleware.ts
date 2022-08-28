import { Connect } from 'vite';
import http from 'node:http';
import AntPathMatcher from '@howiefh/ant-path-matcher';

import { removeTrailingSlash } from '@/utils/misc';
import { ILogger } from '@/utils/logger';

import formatResMsg from '@/helpers/format-res-msg';
import { sendJson } from '@/helpers/send';

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
  dataRoot: string,
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
        const handlerInfo = [`handler = ${JSON.stringify(handler, null, '  ')}`];
        if (Object.keys(urlVars).length) {
          handlerInfo.push(`urlVars = ${JSON.stringify(urlVars, null, '  ')}`);
        }
        const msg = ['matched'];
        if (handler.method && handler.method !== req.method) {
          msg.push(`405 ${http.STATUS_CODES[405]}`, `supported method = ${handler.method}`);
          return sendJson(res, { message: formatResMsg(req, ...msg) }, [...msg, ...handlerInfo], logger, 405);
        }
        logger.info(...msg, ...handlerInfo);
        handler.handle(req, res, { ...urlVars });
        return true;
      }
    }
  }

  const purePath = removePrefix(urlPath, urlPrefixes!);
  if (purePath) {
    if (handleJson(req, res, dataRoot, purePath, logger, urlPath, limit!)) {
      return true;
    }
    if (handleHtml(req, res, dataRoot, purePath, logger)) {
      return true;
    }
    if (handleOther(req, res, dataRoot, purePath, logger)) {
      return true;
    }
  }

  if (noHandlerResponse404) {
    const msg = `404 ${http.STATUS_CODES[404]}`;
    return sendJson(res, { message: formatResMsg(req, msg) }, [msg, `${req.method} ${req.url}`], logger, 404);
  }

  return false;
};

export default runMiddleware;
