import { ServerResponse } from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../../services/logger';
import { handleJson } from '../../../../middleware/handlers/handle-json';

const logger = new Logger('test');
vi.mock('../../../../utils/logger');

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
  res = { ...defRes, req };
};

import { dataRoot } from '../../../data-root';

const defaultLimit = 10;

const contentSrc = fs.readFileSync(path.join(dataRoot, 'array-has-id.json'), 'utf-8');
const jsonSrc = JSON.parse(contentSrc);

reset();
describe('test handleOther', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('/array-has-id?name=a exists, json, should return true', async () => {
    req.url = '/array-has-id?name=a';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    const filtered = jsonSrc.filter(({ name }: any) => name === 'a');
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res.end).toBeCalledWith(JSON.stringify(filtered));
  });

  it('/array-has-id?id=3&id=5 exists, json, should return true', async () => {
    req.url = '/array-has-id?id=3&id=5';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    const filtered = jsonSrc.filter(({ id }: any) => id === 3 || id === 5);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res.end).toBeCalledWith(JSON.stringify(filtered));
  });

  it('/array-has-id?name=xxx exists, json, should return true', async () => {
    req.url = '/array-has-id?name=xxx';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalledWith('{"message":"Not Found, q=name=xxx"}');
  });
});
