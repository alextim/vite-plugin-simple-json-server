import { ServerResponse } from 'node:http';
import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { validateMethod } from '../helpers/validate-method';

const defReq = {
  url: '',
  method: undefined,
};

const defRes = {
  statusCode: 0,
  setHeader: vi.fn(),
  end: vi.fn(),
};
let req;
let res;

const reset = () => {
  req = { ...defReq };
  res = { ...defRes };
};

reset();

describe('test validateMethod', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('not valid method, should return false', () => {
    req = { ...req, method: 'PUT' };
    const result = validateMethod(req as Connect.IncomingMessage, res as ServerResponse, 401);
    expect(result).toBeFalsy();
    expect(res.statusCode).toBe(401);
    expect(res.end).toBeCalledTimes(1);
  });
  it('valid method, should return true', () => {
    req = { ...req, method: 'POST' };
    const result = validateMethod(req as Connect.IncomingMessage, res as ServerResponse, 401, ['POST']);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(0);
    expect(res.end).not.toBeCalled();
  });
});
