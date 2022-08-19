import type { LogLevel, ResolvedConfig } from 'vite';
import { Plugin, ViteDevServer, Connect } from 'vite';
import AntPathMatcher from '@howiefh/ant-path-matcher';
import fs from 'node:fs';
import type { ServerResponse } from 'node:http';
import path from 'node:path';
import querystring from 'node:querystring';
import { addSlashes, isDirExists, isFileExists } from './utils';
import Logger, { ILogger } from './logger';

type FileType = 'json' | 'html' | 'js' | 'css' | 'txt';
const fileTypes: Record<FileType, string> = {
  html: 'text/html',
  json: 'application/json',
  js: 'text/javascript',
  css: 'text/css',
  txt: 'text/plain',
};

const PLUGIN_NAME = 'vite-plugin-mock-server';
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
      // console.log(config)
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
    console.log(route);
    const testingPath = path.join(config.root, mockRootDir!, route);
    if (handleHtml(req, res, testingPath)) {
      return;
    }
    if (handleJson(req, res, testingPath)) {
      return;
    }
    if (handleOther(req, res, testingPath)) {
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

function validateReq(req: Connect.IncomingMessage, res: ServerResponse, code = 403, methods?: string[]) {
  const method = req.method;

  if (!method || method === 'GET') {
    return true;
  }
  if (method === 'HEAD') {
    res.statusCode = 200;
    res.end('[' + PLUGIN_NAME + '] HEAD, { url: "' + req.url + '", method: "' + method + '" }');
    return false;
  }
  if (methods?.some((m) => m === method)) {
    return true;
  }
  res.statusCode = code;
  let msg: string;
  switch (code) {
    case 405:
      msg = '405 Not Allowed';
      break;
    case 403:
      msg = '403 Forbidden';
      break;
    default:
      msg = '';
      break;
  }
  res.end('[' + PLUGIN_NAME + '] ' + msg + ', { url: "' + req.url + '", method: "' + method + '" }');
  return false;
}

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

function handleHtml(req: Connect.IncomingMessage, res: ServerResponse, testingPath: string) {
  console.log('handleHtml');
  const name = isDirExists(testingPath) ? 'index' : '';
  const ext = 'html';

  const filePath = (name ? path.join(testingPath, name) : testingPath) + '.' + ext;
  if (!isFileExists(filePath)) {
    return false;
  }

  if (validateReq(req, res)) {
    sendFileContent(res, filePath, fileTypes[ext]);
  }
  return true;
}

function handleJson(req: Connect.IncomingMessage, res: ServerResponse, testingPath: string) {
  console.log('handleJson');
  console.log('testingPath', testingPath);
  const name = isDirExists(testingPath) ? 'index' : '';
  const ext = 'json';

  const filePath = (name ? path.join(testingPath, name) : testingPath) + '.' + ext;
  if (!isFileExists(filePath)) {
    return false;
  }
  if (!validateReq(req, res, 405, ['POST'])) {
    return true;
  }

  const a = req.url!.split('?');
  if (a.length === 1 || !a[1]) {
    sendFileContent(res, filePath, fileTypes.json);
    return true;
  }

  const q = querystring.parse(a[1]);

  const content = fs.readFileSync(filePath, 'utf-8');

  let page = 0;
  let limit = 0;
  let sort = '';
  let order = 'asc';
  if (q['_page']) {
    page = Math.max(1, parseInt(q['_page'] as string));
  }
  if (q['_limit']) {
    limit = Math.max(0, parseInt(q['_limit'] as string));
    if (limit === 0) {
      limit = 10;
    }
  }
  if (q['_sort']) {
    sort = q['_sort'] as string;
  }

  if (q['_order']) {
    order = q['_order'] as string;
    if (order !== 'asc' && order !== 'desc') {
      order = 'asc';
    }
  }

  logger.info('matched', `file: ${filePath}`);
  res.setHeader('Content-Type', fileTypes.json);

  if (!page && !limit && !sort) {
    res.end(content);
    return true;
  }

  let data = JSON.parse(content);
  if (!Array.isArray(data) || data.length === 0) {
    res.end(content);
    return true;
  }

  if (page || limit) {
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    data = data.slice(start, end);
  }
  if (sort && data[0].hasOwnProperty(sort)) {
    const dir = order === 'asc' ? 1 : -1;
    data = data.sort((a: any, b: any) => {
      if (a[sort] > b[sort]) {
        return 1 * dir;
      }
      if (a[sort] < b[sort]) {
        return -1 * dir;
      }
      return 0;
    });
  }
  res.end(JSON.stringify(data));

  return true;
}

function handleOther(req: Connect.IncomingMessage, res: ServerResponse, testingPath: string) {
  console.log('handleOther');
  if (!isFileExists(testingPath)) {
    return false;
  }
  const { ext } = path.parse(testingPath);
  const key = ext.substring(1) as FileType;
  if (!fileTypes[key]) {
    return false;
  }
  if (validateReq(req, res)) {
    sendFileContent(res, testingPath, fileTypes[key]);
  }
  return true;
}

function removeTrailingSlash(s: string) {
  return s.endsWith('/') ? s.substring(0, s.length - 1) : s;
}

function sendFileContent(res: ServerResponse, filePath: string, mime: string) {
  logger.info('matched', `file: ${filePath}`);

  const data = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', mime);
  res.end(data);
}


