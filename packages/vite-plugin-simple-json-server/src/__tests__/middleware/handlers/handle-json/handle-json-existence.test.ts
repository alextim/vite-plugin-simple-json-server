import { ServerResponse } from 'node:http';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../../services/logger';
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
  res = { ...defRes, req };
};

import { dataRoot } from '../../../data-root';

const defaultLimit = 2;

describe('test handleJson existence', () => {
  beforeEach(reset);
  afterEach(() => void vi.clearAllMocks());

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

  it('/subfolder/not/not-exist not exists, json, should return false', async () => {
    req.url = '/subfolder/not/not-exist';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/not/not-exist',
      logger,
      '/subfolder/not/not-exist',
      defaultLimit,
    );
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });

  it('/not/not-exist not exists, json, should return false', async () => {
    req.url = '/not/not-exist';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'not/not-exist',
      logger,
      '/not/not-exist',
      defaultLimit,
    );
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });

  it('/ index.json not exists, json, should return false', async () => {
    req.url = '/';
    const result = await handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '', logger, '/', defaultLimit);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });

  it('/subfolder index.json exists, json, should return true', async () => {
    req.url = '/subfolder';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder',
      logger,
      '/subfolder',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode === 200).toBeTruthy();
    expect(res.end).toBeCalled();
  });

  it('/object exists, json, should return true', async () => {
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
    expect(res.statusCode === 200).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/subfolder exists, json, should return true', async () => {
    req.url = '/subfolder';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder',
      logger,
      '/subfolder',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode === 200).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/subfolder/object exists, json, should return true', async () => {
    req.url = '/subfolder/object';
    const result = await handleJson(
      req as Connect.IncomingMessage,
      res as ServerResponse,
      dataRoot,
      'subfolder/object',
      logger,
      '/subfolder/object',
      defaultLimit,
    );
    expect(result).toBeTruthy();
    expect(res.statusCode === 200).toBeTruthy();
    expect(res.end).toBeCalled();
  });
});
