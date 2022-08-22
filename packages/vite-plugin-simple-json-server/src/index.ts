import type { LogLevel, ResolvedConfig } from 'vite';
import { Plugin, ViteDevServer, Connect } from 'vite';

import type { ServerResponse } from 'node:http';
import path from 'node:path';

import AntPathMatcher from '@howiefh/ant-path-matcher';

import type { SimpleJsonServerPluginOptions, MockHandler, MockFunction } from './types';

import { PLUGIN_NAME } from './constants';

import { removeTrailingSlash } from './utils/misc';
import Logger, { ILogger } from './utils/logger';

import { handleHtml } from './handlers/handle-html';
import { handleJson } from './handlers/handle-json/handle-json';
import { handleOther } from './handlers/handle-other';

import formatResMsg from './helpers/format-res-msg';

import { validateOptions } from './validate-options';

export type { SimpleJsonServerPluginOptions, MockHandler, MockFunction, LogLevel };

let logger: ILogger;

const simpleJsonServerPlugin = (options: SimpleJsonServerPluginOptions = {}): Plugin => {
  let config: ResolvedConfig;

  return {
    name: PLUGIN_NAME,

    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },

    async configureServer(server: ViteDevServer) {
      // build url matcher
      const matcher = new AntPathMatcher();

      const opts = validateOptions(options);

      logger = new Logger(PLUGIN_NAME, opts.logLevel);
      logger.info('mock server started.', `options = ${JSON.stringify(opts, null, '  ')}`);

      server.middlewares.use((req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        doHandle(opts, config.root, matcher, req, res, next);
      });
    },
  };
};

const doHandle = async (
  options: SimpleJsonServerPluginOptions,
  viteRoot: string,
  matcher: AntPathMatcher,
  req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
) => {
  if (!req?.url || !options.urlPrefixes || !options.urlPrefixes.some((prefix) => req.url!.startsWith(prefix))) {
    next();
    return;
  }

  let urlPath = removeTrailingSlash(req.url.split('?')[0]);

  try {
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
            return;
          }
          logger.info(...msg, ...handlerInfo);
          handler.handle(req, res, { ...urlVars });
          return;
        }
      }
    }

    urlPath = removePrefix(urlPath, options.urlPrefixes);
    if (urlPath) {
      const testingPath = path.join(viteRoot, options.mockRootDir!, urlPath);
      if (handleHtml(req, res, testingPath, logger)) {
        return;
      }
      if (handleJson(req, res, viteRoot, options, urlPath, logger)) {
        return;
      }
      if (handleOther(req, res, testingPath, logger)) {
        return;
      }
    }

    if (options.noHandlerResponse404) {
      const msg = '404 No handler or file found';
      res.statusCode = 404;
      logger.info(msg, `${req.method} ${req.url}`);
      res.end(formatResMsg(req, msg));
      return;
    }

    next();
  } catch (err: any) {
    const msg = ['500 Server error', err.toString()];
    logger.error(...msg);
    res.statusCode = 500;
    res.end(formatResMsg(req, ...msg));
    return;
  }
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
