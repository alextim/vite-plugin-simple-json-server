import { ServerResponse } from 'node:http';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../utils/logger';
import { handleOther } from '../../../middleware/handlers/handle-other';

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

import { dataRoot } from '../../data-root';

reset();
describe('test handleOther', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('/not-exist.html not exist, should return false', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '/not-exist.html', logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
  it('/index.html exists, html, should return true', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '/index.html', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c/d/d1.json exists, json, should return true', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '/c/d/d1.json', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/c/d/x.xyz exists, unknown, should return false', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '/c/d/x.xyz', logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
});
