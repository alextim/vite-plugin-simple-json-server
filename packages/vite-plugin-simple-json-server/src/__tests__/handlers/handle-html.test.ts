import { ServerResponse } from 'node:http';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '@/utils/logger';
import { handleHtml } from '@/handlers/handle-html';

import { dataRoot } from '../data-root';

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

reset();
describe('test handleHtml', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('path not exist, should return false', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'not-exist', logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
  it('/ exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '/', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '/c', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c/d/dd exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '/c/dd', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
});
