import { ServerResponse } from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../../utils/logger';
import { handleJson } from '../../../../middleware/handlers/handle-json';

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

import { dataRoot } from '../../../data-root';

const defaultLimit = 10;

const contentSrc = fs.readFileSync(path.join(dataRoot, 'test.json'), 'utf-8');
const jsonSrc = JSON.parse(contentSrc);

reset();
describe('test handleOther', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('PUT /test exists, json, should return true, 405', () => {
    req.method = 'PUT';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'test', logger, '/test', defaultLimit);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalled();
  });

  it('/test?offset=2&limit=3 exists, json, should return true', () => {
    req.url = '/test?offset=2&limit=3';
    req.headers = {
      host: 'test:123',
    };
    const mockHeaders = {
      Link: 'abc',
    };
    res.hasHeader = vi.fn().mockImplementationOnce(() => true);
    res.getHeader = vi.fn().mockImplementation((key: string) => mockHeaders[key]);
    res.setHeader = vi.fn().mockImplementation((key: string, val: string) => {
      mockHeaders[key] = val;
    });
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'test', logger, '/test', defaultLimit);
    const paged = jsonSrc.slice(2, 2 + 3);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(paged));
    expect(mockHeaders.Link).toBe(
      'abc,<http://test:123/test?limit=3&offset=0>;rel="prev",<http://test:123/test?limit=3&offset=5>;rel="next",<http://test:123/test?limit=3&offset=0>;rel="first",<http://test:123/test?limit=3&offset=9>;rel="last"',
    );
  });

  it('/test?color=stringer exists, json, should return true', () => {
    req.url = '/test?color=stringer';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'test', logger, '/test', defaultLimit);
    const filtered = jsonSrc.filter(({ color }) => color === 'stringer');
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(filtered));
  });
  it('/test?color=xxx exists, json, should return true', () => {
    req.url = '/test?color=xxx';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'test', logger, '/test', defaultLimit);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith('{"message":"test with q = color=xxx not found"}');
  });
});
