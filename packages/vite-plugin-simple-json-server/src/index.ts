import type { LogLevel, ResolvedConfig } from 'vite';
import { Plugin, ViteDevServer, Connect } from 'vite';
import AntPathMatcher from '@howiefh/ant-path-matcher';

import type { ServerResponse } from 'node:http';
import path from 'node:path';

import { addSlashes, removeTrailingSlash } from './utils';
import Logger, { ILogger } from './logger';
import { PLUGIN_NAME } from './constants';

import { handleHtml } from './handle-html';
import { handleJson } from './handle-json';
import { handleOther } from './handle-other';

let logger: ILogger;

export type MockFunction = {
  (req: Connect.IncomingMessage, res: ServerResponse, urlVars?: { [key: string]: string }): void;
};

export type MockHandler = {
  pattern: string;
  method?: string;
  handle: MockFunction;
};

export type MockOptions = {
  logLevel?: LogLevel;
  urlPrefixes?: string[];
  handlers?: MockHandler[];
  mockRootDir?: string;
  noHandlerResponse404?: boolean;
};

const defaultOptions: MockOptions = {
  logLevel: 'info',
  urlPrefixes: ['/api/'],
  mockRootDir: 'mock',
  noHandlerResponse404: true,
};

export default (options: MockOptions = {}): Plugin => {
  let config: ResolvedConfig;

  return {
    name: PLUGIN_NAME,

    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },

    configureServer: async (server: ViteDevServer) => {
      // build url matcher
      const matcher = new AntPathMatcher();

      // init options
      options.logLevel = options.logLevel || defaultOptions.logLevel;
      let urlPrefixes: string[] | undefined = undefined;
      if (Array.isArray(options.urlPrefixes)) {
        urlPrefixes = options.urlPrefixes.filter(Boolean).map(addSlashes);
      }
      options.urlPrefixes = urlPrefixes?.length ? urlPrefixes : defaultOptions.urlPrefixes;
      options.mockRootDir = options.mockRootDir || defaultOptions.mockRootDir;
      options.noHandlerResponse404 = options.noHandlerResponse404 ?? defaultOptions.noHandlerResponse404;

      logger = new Logger(PLUGIN_NAME, options.logLevel);

      logger.info('mock server started.', `options = ${JSON.stringify(options, null, '  ')}`);

      server.middlewares.use((req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        doHandle(options, config, matcher, req, res, next);
      });
    },
  };
};

const doHandle = async (
  { handlers, urlPrefixes, mockRootDir, noHandlerResponse404 }: MockOptions,
  config: ResolvedConfig,
  matcher: AntPathMatcher,
  req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
) => {
  if (!req?.url || !urlPrefixes || !urlPrefixes.some((prefix) => req.url!.startsWith(prefix))) {
    next();
    return;
  }

  if (handlers) {
    const normalizedUrl = req.url.endsWith('/') ? req.url.substring(0, req.url.length - 1) : req.url;

    for (const handler of handlers) {
      let path = normalizedUrl;
      const index = path.indexOf('?');
      if (index > 0) {
        path = path.substring(0, index);
      }
      const pathVars: Record<string, string> = {};
      let matched = matcher.doMatch(handler.pattern, path, true, pathVars);
      if (matched && handler.method) {
        matched = handler.method === req.method;
      }
      if (matched) {
        logger.info('matched', `handler = ${JSON.stringify(handler, null, '  ')}`, `pathVars = ${JSON.stringify(pathVars, null, '  ')}`);
        handler.handle(req, res, { ...pathVars });
        return;
      }
    }
  }

  const route = getRoute(req.url, urlPrefixes);
  if (route) {
    const testingPath = path.join(config.root, mockRootDir!, route);
    if (handleHtml(req, res, testingPath, logger)) {
      return;
    }
    if (handleJson(req, res, testingPath, logger)) {
      return;
    }
    if (handleOther(req, res, testingPath, logger)) {
      return;
    }
  }

  if (noHandlerResponse404) {
    res.statusCode = 404;
    const { url, method } = req;
    res.end('[' + PLUGIN_NAME + '] no handler found, { url: "' + url + '", method: "' + method + '" }');
    return;
  }

  next();
};

function getRoute(url: string, urlPrefixes: string[]) {
  for (const prefix of urlPrefixes) {
    if (url.startsWith(prefix)) {
      const s = url.substring(prefix.length);
      const a = s.split('?');
      return removeTrailingSlash(a[0]);
    }
  }
  return '';
}
