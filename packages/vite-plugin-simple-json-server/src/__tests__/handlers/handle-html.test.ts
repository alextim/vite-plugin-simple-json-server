import { ServerResponse } from 'node:http';
import path from 'node:path';
import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../utils/logger';
import { handleHtml } from '../../handlers/handle-html';
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
describe('test handleHtml', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('path not exist, should return false', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, 'not-exist', options, logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
  it('/ exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/c', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c/d/dd exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, viteRoot, '/c/dd', options, logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
});
