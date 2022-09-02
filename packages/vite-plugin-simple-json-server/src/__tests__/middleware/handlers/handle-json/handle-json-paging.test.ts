import { ServerResponse } from 'node:http';
import fs from 'node:fs';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../../services/logger';
import { handleJson } from '../../../../middleware/handlers/handle-json';

const logger = new Logger('test');
vi.mock('../../../../utils/logger');

let req: any;
let res: any;
let mockHeaders: any;

const reset = () => {
  req = {
    url: '',
    method: 'GET',
    headers: {
      host: 'h',
    },
  };

  res = {
    statusCode: 0,
    hasHeader: vi.fn().mockImplementation(() => true),
    getHeader: vi.fn().mockImplementation((key: string) => mockHeaders[key]),
    setHeader: vi.fn().mockImplementation((key: string, val: string) => {
      mockHeaders[key] = val;
    }),
    end: vi.fn(),
    req,
  };

  mockHeaders = {
    Link: 'abc',
  };
};

import { dataRoot } from '../../../data-root';
import path from 'node:path';

const contentSrc = fs.readFileSync(path.join(dataRoot, 'array-has-id.json'), 'utf-8');
const jsonSrc = JSON.parse(contentSrc);

const getUrl = (offset: number, limit: number) => `/array-has-id?offset=${offset}&limit=${limit}`;

describe('test handleJson paging', () => {
  beforeEach(reset);
  afterEach(() => void vi.clearAllMocks());

  it('2 2, should return true', async () => {
    const offset = 2;
    const defaultLimit = 2;
    req.url = getUrl(offset, defaultLimit);

    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    const paged = (jsonSrc as any[]).slice(offset, offset + defaultLimit);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(paged));
    expect(mockHeaders.Link).toBe(
      'abc,<http://h/array-has-id?limit=2&offset=0>;rel="prev",<http://h/array-has-id?limit=2&offset=4>;rel="next",<http://h/array-has-id?limit=2&offset=0>;rel="first",<http://h/array-has-id?limit=2&offset=4>;rel="last"',
    );
    expect(mockHeaders['X-Total-Count']).toBe(6);
  });

  it('0 5, should return true', async () => {
    const offset = 0;
    const defaultLimit = 5;
    req.url = getUrl(offset, defaultLimit);

    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    const paged = (jsonSrc as any[]).slice(offset, offset + defaultLimit);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(paged));
    expect(mockHeaders.Link).toBe(
      'abc,<http://h/array-has-id?limit=5&offset=5>;rel="next",<http://h/array-has-id?limit=5&offset=0>;rel="first",<http://h/array-has-id?limit=5&offset=5>;rel="last"',
    );
  });

  it('0 10, should return true', async () => {
    const offset = 0;
    const defaultLimit = 10;
    req.url = getUrl(offset, defaultLimit);

    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    const paged = (jsonSrc as any[]).slice(offset, offset + defaultLimit);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(paged));
    expect(mockHeaders.Link).toBe(
      'abc,<http://h/array-has-id?limit=10&offset=0>;rel="first",<http://h/array-has-id?limit=10&offset=0>;rel="last"',
    );
  });

  it('3 10 exists, json, should return true', async () => {
    const offset = 3;
    const defaultLimit = 10;
    req.url = getUrl(offset, defaultLimit);

    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    const paged = (jsonSrc as any[]).slice(offset, offset + defaultLimit);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify(paged));
    expect(mockHeaders.Link).toBe(
      'abc,<http://h/array-has-id?limit=10&offset=0>;rel="prev",<http://h/array-has-id?limit=10&offset=0>;rel="first",<http://h/array-has-id?limit=10&offset=3>;rel="last"',
    );
  });
});
