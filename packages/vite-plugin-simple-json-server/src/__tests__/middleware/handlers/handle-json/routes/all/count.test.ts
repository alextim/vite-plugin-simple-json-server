import { ServerResponse } from 'node:http';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../../../../services/logger';
import { handleJson } from '../../../../../../middleware/handlers/handle-json';

const logger = new Logger('test');
vi.mock('../../../../../../utils/logger');

const defReq = {
  url: '',
  method: 'HEAD',
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

import { dataRoot } from '../../../../../data-root';

const defaultLimit = 2;

describe('test handleJson count', () => {
  beforeEach(reset);
  afterEach(() => void vi.clearAllMocks());
  it('/array-empty exists, json, should return true', async () => {
    req.url = '/array-empty';
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
    expect(res.statusCode).toBe(204);
    expect(res.setHeader).toBeCalledWith('X-Total-Count', 0);
  });

  it('/array-empty?id=2 exists, json, should return true', async () => {
    req.url = '/array-empty?id=2';
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
    expect(res.statusCode).toBe(204);
    expect(res.setHeader).toBeCalledWith('X-Total-Count', 0);
  });

  it('/array-has-id exists, json, should return true', async () => {
    req.url = '/array-has-id';
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
    expect(res.statusCode).toBe(204);
    expect(res.setHeader).toBeCalledWith('X-Total-Count', 6);
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
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(204);
    expect(res.setHeader).toBeCalledWith('X-Total-Count', 2);
  });

  it('/array-has-id?id=2&id=3&id=100 exists, json, should return true', async () => {
    req.url = '/array-has-id?id=2&id=3&id=100';
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
    expect(res.statusCode).toBe(204);
    expect(res.setHeader).toBeCalledWith('X-Total-Count', 2);
  });

  it('/array-has-id?name=x exists, json, should return true', async () => {
    req.url = '/array-has-id?name=x';
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
    expect(res.statusCode).toBe(204);
    expect(res.setHeader).toBeCalledWith('X-Total-Count', 0);
  });

  it('/array-has-id?absent-prop=1 exists, json, should return true', async () => {
    req.url = '/array-has-id?absent-prop=1';
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
    expect(res.statusCode).toBe(204);
    expect(res.setHeader).toBeCalledWith('X-Total-Count', 0);
  });

  it('/object exists, json, should return true, 405', async () => {
    req.url = '/object';
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
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalled();
  });

  it('/not-exist not exists, json, should return false', async () => {
    req.url = '/not-exist';
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
