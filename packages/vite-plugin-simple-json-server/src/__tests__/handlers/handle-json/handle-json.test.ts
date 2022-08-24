import { ServerResponse } from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../utils/logger';
import { handleJson } from '../../../handlers/handle-json';
import { SimpleJsonServerPluginOptions } from '../../../types';
import { fileURLToPath } from 'node:url';

const logger = new Logger('test');

const defReq = {
  url: '',
  method: 'GET',
};

const defRes = {
  statusCode: 0,
  setHeader: vi.fn(),
  end: vi.fn(),
};
let req: any;
let res: any;

const reset = () => {
  req = { ...defReq };
  res = { ...defRes };
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteRoot = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'examples', 'basic');

const options = {
  mockRootDir: 'mock',
} as SimpleJsonServerPluginOptions;

const contentSrc = fs.readFileSync(path.join(viteRoot, options.mockRootDir!, 'test.json'), 'utf-8');
const jsonSrc = JSON.parse(contentSrc);

reset();
describe('test handleOther', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('path not exist, should return false', () => {
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/not-exist', options, logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
  it('/ exists, bit html, should return false', () => {
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/', options, logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
  it('PUT /test exists, json, should return true, 405', () => {
    req.method = 'PUT';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test', options, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalled();
  });

  it('/test exists, json, should return true', () => {
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(contentSrc);
  });

  it('/test/count exists, json, should return true', () => {
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test/count', options, logger);
    const itemsCount = jsonSrc.length;
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: itemsCount }));
  });

  it('/test/count?color=stringer exists, json, should return true', () => {
    req.url = '/test/count?color=stringer';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test/count', options, logger);
    const itemsCount = jsonSrc.filter(({ color }) => color === 'stringer').length;
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: itemsCount }));
  });

  it('/test/count?color=xxx exists, json, should return true', () => {
    req.url = '/test/count?color=xxx';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test/count', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 0 }));
  });

  it('/test?offset=2&limit=3 exists, json, should return true', () => {
    req.url = '/test?offset=2&limit=3';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test', options, logger);
    const paged = jsonSrc.slice(2, 2 + 3);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(paged));
  });

  it('/test?color=stringer exists, json, should return true', () => {
    req.url = '/test?color=stringer';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test', options, logger);
    const filtered = jsonSrc.filter(({ color }) => color === 'stringer');
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(filtered));
  });
  it('/test?color=xxx exists, json, should return true', () => {
    req.url = '/test?color=xxx';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/test', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify([]));
  });

  it('/c/d/d1/count exists, json, should return true, 405', () => {
    req.url = '/c/d/d1/count';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/c/d/d1/count', options, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalled();
  });

  it('/c/d/d1 exists, json, should return true', () => {
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/c/d/d1', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c/d/d exists, json, should return true', () => {
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/c/d/d', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
});
