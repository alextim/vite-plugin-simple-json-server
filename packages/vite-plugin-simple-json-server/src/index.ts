import type { LogLevel, ResolvedConfig } from 'vite';
import { Plugin, ViteDevServer, Connect } from 'vite';

import type { ServerResponse } from 'node:http';
import path from 'node:path';

import AntPathMatcher from '@howiefh/ant-path-matcher';

import { PLUGIN_NAME } from './constants';

import { addSlashes, removeTrailingSlash } from './utils/misc';
import Logger, { ILogger } from './utils/logger';

import { handleHtml } from './handlers/handle-html';
import { handleJson } from './handlers/handle-json';
import { handleOther } from './handlers/handle-other';
import formatResMsg from './helpers/format-res-msg';

let logger: ILogger;

export type MockFunction = {
  (req: Connect.IncomingMessage, res: ServerResponse, urlVars?: Record<string, string>): void;
};

export type MockHandler = {
  pattern: string;
  method?: string;
  handle: MockFunction;
};

export type SimpleJsonServerPluginOptions = {
  logLevel?: LogLevel;
  urlPrefixes?: string[];
  handlers?: MockHandler[];
  mockRootDir?: string;
  noHandlerResponse404?: boolean;
};

const defaultOptions: SimpleJsonServerPluginOptions = {
  logLevel: 'info',
  urlPrefixes: ['/api/'],
  mockRootDir: 'mock',
  noHandlerResponse404: true,
};

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

      // init options
      options.logLevel = options.logLevel || defaultOptions.logLevel;
      const urlPrefixes = Array.isArray(options.urlPrefixes) ? options.urlPrefixes.filter(Boolean).map(addSlashes) : [];

      options.urlPrefixes = urlPrefixes.length ? urlPrefixes : defaultOptions.urlPrefixes;
      options.mockRootDir = options.mockRootDir || defaultOptions.mockRootDir;
      options.noHandlerResponse404 = options.noHandlerResponse404 ?? defaultOptions.noHandlerResponse404;

      logger = new Logger(PLUGIN_NAME, options.logLevel);

      logger.info('mock server started.', `options = ${JSON.stringify(options, null, '  ')}`);

      server.middlewares.use((req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        doHandle(options, config.root, matcher, req, res, next);
      });
    },
  };
};

const doHandle = async (
  { handlers, urlPrefixes, mockRootDir, noHandlerResponse404 }: SimpleJsonServerPluginOptions,
  viteRoot: string,
  matcher: AntPathMatcher,
  req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
) => {
  if (!req?.url || !urlPrefixes || !urlPrefixes.some((prefix) => req.url!.startsWith(prefix))) {
    next();
    return;
  }

  let urlPath = removeTrailingSlash(req.url.split('?')[0]);

  try {
    if (handlers) {
      for (const handler of handlers) {
        const urlVars: Record<string, string> = {};
        if (matcher.doMatch(handler.pattern, urlPath, true, urlVars)) {
          if (handler.method && handler.method !== req.method) {
            logger.info(
              'matched (405 Not Allowed)',
              `handler = ${JSON.stringify(handler, null, '  ')}`,
              `urlVars = ${JSON.stringify(urlVars, null, '  ')}`,
            );
            res.statusCode = 405;
            res.end(formatResMsg('405 Not Allowed', req.url, req.method));
            return;
          }
          logger.info('matched', `handler = ${JSON.stringify(handler, null, '  ')}`, `urlVars = ${JSON.stringify(urlVars, null, '  ')}`);
          handler.handle(req, res, { ...urlVars });
          return;
        }
      }
    }

    urlPath = removePrefix(urlPath, urlPrefixes);
    if (urlPath) {
      const testingPath = path.join(viteRoot, mockRootDir!, urlPath);
      if (handleHtml(req, res, testingPath, logger)) {
        return;
      }
      if (handleJson(req, res, viteRoot, mockRootDir!, urlPath, logger)) {
        return;
      }
      if (handleOther(req, res, testingPath, logger)) {
        return;
      }
    }

    if (noHandlerResponse404) {
      res.statusCode = 404;
      res.end(formatResMsg('no handler found', req.url, req.method));
      return;
    }

    next();
  } catch (err: any) {
    logger.error(err.toString());
    res.statusCode = 500;
    res.end(formatResMsg('500 Server error ' + err.toString(), req.url, req.method));
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
