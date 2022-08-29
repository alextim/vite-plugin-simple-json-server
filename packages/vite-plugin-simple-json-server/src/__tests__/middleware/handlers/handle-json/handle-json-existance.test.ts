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

describe('test handleOther existance', () => {
  beforeEach(reset);
  afterEach(() => void vi.clearAllMocks());

  it('/not-exist not exists, json, should return false', () => {
    req.url = '/not-exist';
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

  it('/subfolder/not/not-exist not exists, json, should return false', () => {
    req.url = '/subfolder/not/not-exist';
    const result = handleJson(
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

  it('/not/not-exist not exists, json, should return false', () => {
    req.url = '/not/not-exist';
    const result = handleJson(
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

  it('/ index.json not exists, json, should return false', () => {
    req.url = '/';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '', logger, '/', defaultLimit);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });

  it('/subfolder index.json exists, json, should return true', () => {
    req.url = '/subfolder';
    const result = handleJson(
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

  it('/object exists, json, should return true', () => {
    req.url = '/object';
    const result = handleJson(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'object', logger, '/object', defaultLimit);
    expect(result).toBeTruthy();
    expect(res.statusCode === 200).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/subfolder exists, json, should return true', () => {
    req.url = '/subfolder';
    const result = handleJson(
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
  it('/subfolder/object exists, json, should return true', () => {
    req.url = '/subfolder/object';
    const result = handleJson(
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
