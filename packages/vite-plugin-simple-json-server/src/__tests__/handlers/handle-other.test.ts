import { ServerResponse } from 'node:http';
import path from 'node:path';
import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../utils/logger';
import { handleOther } from '../../handlers/handle-other';
import { SimpleJsonServerPluginOptions } from '../../types';
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

const viteRoot = path.join(__dirname, '..', '..', '..', '..', '..', 'examples', 'basic');

const options = {
  mockRootDir: 'mock',
} as SimpleJsonServerPluginOptions;

reset();
describe('test handleOther', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('/not-exist.html not exist, should return false', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/not-exist.html', options, logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
  it('/index.html exists, html, should return true', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/index.html', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c/d/d1.json exists, json, should return true', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/c/d/d1.json', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c/d/x.xyz exists, unknown, should return false', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/c/d/x.xyz', options, logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
});
