import { ServerResponse } from 'node:http';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../../utils/logger';
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
  res = { ...defRes };
};

import { dataRoot } from '../../../data-root-2';

const defaultLimit = 2;

describe('test handleOther count', () => {
  beforeEach(reset);
  afterEach(() => void vi.clearAllMocks());
  it('/array-empty?count exists, json, should return true', () => {
    req.url = '/array-empty?count';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-empty',
      logger,
      '/array-empty',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 0 }));
  });
  it('/array-empty?count&id=2 exists, json, should return true', () => {
    req.url = '/array-empty?count&id-2';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-empty',
      logger,
      '/array-empty',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 0 }));
  });

  it('/array-has-id?count exists, json, should return true', () => {
    req.url = '/array-has-id?count';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 6 }));
  });
  it('/array-has-id?count&name=a exists, json, should return true', () => {
    req.url = '/array-has-id?count&name=a';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 2 }));
  });
  it('/array-has-id?count&name=x exists, json, should return true', () => {
    req.url = '/array-has-id?count&name=x';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 0 }));
  });

  it('/array-has-id?count&absent-prop=1 exists, json, should return true', () => {
    req.url = '/array-has-id?count&absent-prop=1';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id',
      logger,
      '/array-has-id',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 0 }));
  });

  it('/object?count exists, json, should return true, 405', () => {
    req.url = '/object?count';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'object', logger, '/object', defaultLimit);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalled();
  });

  it('/array-empty?count exists, json, method PUT, should return true, 405', () => {
    req.url = '/array-empty?count';
    req.method = 'PUT';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-empty',
      logger,
      '/array-empty',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalled();
  });

  it('/not-exist?count not exists, json, should return false', () => {
    req.url = '/not-exist?count';
    const result = handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'not-exist',
      logger,
      '/not-exist',
      defaultLimit,
    );
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
});
