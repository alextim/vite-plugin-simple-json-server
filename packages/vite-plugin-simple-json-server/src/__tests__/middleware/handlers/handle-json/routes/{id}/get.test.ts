import { ServerResponse } from 'node:http';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../../../../services/logger';
import { handleJson } from '../../../../../../middleware/handlers/handle-json';

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

import { dataRoot } from '../../../../../data-root';

const defaultLimit = 2;

describe('test handleJson get by id', () => {
  beforeEach(reset);
  afterEach(() => void vi.clearAllMocks());
  it('/array-empty/1 resource not exist, json, should return true, 404', async () => {
    req.url = '/array-empty/1';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-empty/1',
      logger,
      '/array-empty/1',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });
  it('/array-empty/1?count resource not exist, json, count is ignored, should return true, 404', async () => {
    req.url = '/array-empty/1?count';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-empty/1',
      logger,
      '/array-empty/1',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });

  it('/subfolder/array-empty/1 resource not exist, json, should return true, 404', async () => {
    req.url = '/subfolder/array-empty/1';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/array-empty/1',
      logger,
      '/subfolder/array-empty/1',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });
  it('/subfolder/array-empty/1?count resource not exist, json, count is ignored, should return true, 404', async () => {
    req.url = '/subfolder/array-empty/1?count';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/array-empty/1',
      logger,
      '/subfolder/array-empty/1',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });

  it('/array-has-id/1 exists, json, should return true', async () => {
    req.url = '/array-has-id/2';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id/2',
      logger,
      '/array-has-id/2',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ id: 2, name: 'b', description: 'b' }));
  });
  it('/subfolder/array-has-id/2 exists, json, should return true', async () => {
    req.url = '/subfolder/array-has-id/2';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/array-has-id/2',
      logger,
      '/subfolder/array-has-id/2',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.end).toBeCalledWith(JSON.stringify({ id: 2, name: 'b' }));
  });

  it('/array-has-id/33 not exists, json, should return true, 404', async () => {
    req.url = '/array-has-id/33';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'array-has-id/33',
      logger,
      '/array-has-id/33',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });
  it('/subfolder/array-has-id/33 not exists, json, should return true, 404', async () => {
    req.url = '/subfolder/array-has-id/33';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/array-has-id/33',
      logger,
      '/subfolder/array-has-id/33',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });

  it('/object/1 not exists, json, should return true, 404', async () => {
    req.url = '/object/1';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'object/1',
      logger,
      '/object/1',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });
  it('/subfolder/object/1 not exists, json, should return true, 404', async () => {
    req.url = '/subfolder/object/1';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/object/1',
      logger,
      '/subfolder/object/1',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalled();
  });

  it('/not-exist/1 not exists, json, should return false', async () => {
    req.url = '/not-exist/1';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'not-exist/1',
      logger,
      '/not-exist/1',
      defaultLimit,
    );
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });

  it('/subfolder/not-exist/1 not exists, json, should return false', async () => {
    req.url = '/subfolder/not-exist/1';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/not-exist/1',
      logger,
      '/subfolder/not-exist/1',
      defaultLimit,
    );
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
});
