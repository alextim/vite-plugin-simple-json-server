import { ServerResponse } from 'node:http';

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

const defaultLimit = 2;

describe('test handleJson count', () => {
  beforeEach(reset);
  afterEach(() => void vi.clearAllMocks());
  it('/array-empty?count exists, json, should return true', async () => {
    req.url = '/array-empty?count';
    const result = await handleJson(
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

  it('/array-empty?count&id=2 exists, json, should return true', async () => {
    req.url = '/array-empty?count&id-2';
    const result = await handleJson(
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

  it('/array-has-id?count exists, json, should return true', async () => {
    req.url = '/array-has-id?count';
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
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 6 }));
  });

  it('/array-has-id?count&name=a exists, json, should return true', async () => {
    req.url = '/array-has-id?count&name=a';
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
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 2 }));
  });

  it('/array-has-id?count&id=2&id=3&id=100 exists, json, should return true', async () => {
    req.url = '/array-has-id?count&id=2&id=3&id=100';
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
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 2 }));
  });

  it('/array-has-id?count&name=x exists, json, should return true', async () => {
    req.url = '/array-has-id?count&name=x';
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
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 0 }));
  });

  it('/array-has-id?count&absent-prop=1 exists, json, should return true', async () => {
    req.url = '/array-has-id?count&absent-prop=1';
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
    expect(res.end).toBeCalledWith(JSON.stringify({ count: 0 }));
  });

  it('/object?count exists, json, should return true, 200', async () => {
    req.url = '/object?count';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'object',
      logger,
      '/object',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res.end).toBeCalled();
  });

  it('/not-exist?count not exists, json, should return false', async () => {
    req.url = '/not-exist?count';
    const result = await handleJson(
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
