import type { LogLevel, ResolvedConfig } from 'vite';
import { Plugin, ViteDevServer, Connect } from 'vite';
import path from 'node:path';

import type { ServerResponse } from 'node:http';

import AntPathMatcher from '@howiefh/ant-path-matcher';

import type { SimpleJsonServerPluginOptions, MockHandler, MockFunction } from './types';

import { PLUGIN_NAME } from './plugin-name';

import { removeTrailingSlash } from '@/utils/misc';
import Logger, { ILogger } from '@/utils/logger';

import formatResMsg from '@/helpers/format-res-msg';

import { validateOptions } from './validate-options';

import { handleHtml } from './handlers/handle-html';
import { handleJson } from './handlers/handle-json';
import { handleOther } from './handlers/handle-other';

export type { SimpleJsonServerPluginOptions, MockHandler, MockFunction, LogLevel };

let logger: ILogger;

const simpleJsonServerPlugin = (options: SimpleJsonServerPluginOptions = {}): Plugin => {
  let config: ResolvedConfig;
  let dataRoot: string;

  return {
    name: PLUGIN_NAME,

    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },

    async configureServer(devServer: ViteDevServer) {
      // build url matcher
      const matcher = new AntPathMatcher();

      const opts = validateOptions(options);

      dataRoot = path.join(config.root, options.mockRootDir!);

      logger = new Logger(PLUGIN_NAME, opts.logLevel);
      logger.info('mock server started.', `options = ${JSON.stringify(opts, null, '  ')}`);

      devServer.middlewares.use((req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        try {
          if (!doHandle(req, res, dataRoot, opts, matcher)) {
            next();
          }
        } catch (err: any) {
          logger.error(err.toString());
          devServer.ssrFixStacktrace(err);
          process.exitCode = 1;
          next(err);
        }
      });
    },
  };
};

const isOurApi = (url: string | undefined, urlPrefixes: string[] | undefined) =>
  url && urlPrefixes && urlPrefixes.some((prefix) => url.startsWith(prefix));

const doHandle = async (
  req: Connect.IncomingMessage,
  res: ServerResponse,
  dataRoot: string,
  options: SimpleJsonServerPluginOptions,
  matcher: AntPathMatcher,
) => {
  if (!isOurApi(req?.url, options.urlPrefixes)) {
    return false;
  }

  let urlPath = removeTrailingSlash(req!.url!.split('?')[0]);

  if (options.handlers) {
    for (const handler of options.handlers) {
      const urlVars: Record<string, string> = {};
      if (matcher.doMatch(handler.pattern, urlPath, true, urlVars)) {
        const handlerInfo = [`handler = ${JSON.stringify(handler, null, '  ')}`];
        if (Object.keys(urlVars).length) {
          handlerInfo.push(`urlVars = ${JSON.stringify(urlVars, null, '  ')}`);
        }
        const msg = ['matched'];
        if (handler.method && handler.method !== req.method) {
          msg.push('405 Not Allowed', `supported method = ${handler.method}`);
          logger.info(...msg, ...handlerInfo);
          res.statusCode = 405;
          res.end(formatResMsg(req, ...msg));
          return true;
        }
        logger.info(...msg, ...handlerInfo);
        handler.handle(req, res, { ...urlVars });
        return true;
      }
    }
  }

  urlPath = removePrefix(urlPath, options.urlPrefixes!);
  if (urlPath) {
    if (handleHtml(req, res, dataRoot, urlPath, logger)) {
      return true;
    }
    if (handleJson(req, res, dataRoot, urlPath, options.limit!, logger)) {
      return true;
    }
    if (handleOther(req, res, dataRoot, urlPath, logger)) {
      return true;
    }
  }

  if (options.noHandlerResponse404) {
    const msg = '404 No handler or file found';
    logger.info(msg, `${req.method} ${req.url}`);
    res.statusCode = 404;
    res.end(formatResMsg(req, msg));
    return true;
  }

  return false;
};

function removePrefix(url: string, urlPrefixes: string[]) {
  for (const prefix of urlPrefixes) {
    if (url.startsWith(prefix)) {
      return url.substring(prefix.length);
    }
  }
  return '';
}

export default simpleJsonServerPlugin;
