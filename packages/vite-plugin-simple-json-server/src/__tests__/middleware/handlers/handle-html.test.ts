import { ServerResponse } from 'node:http';

import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../../../utils/logger';
import { handleHtml } from '../../../middleware/handlers/handle-html';

import { dataRoot } from '../../data-root-2';

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

reset();
describe('test handleHtml', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('path not exist, should return false', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'not-exist', logger);
    expect(result).toBeFalsy();
    expect(res.end).not.toBeCalled();
  });
  it('"/", index.html exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, '', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('"/second", second.html exists, html, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'second', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('"/subfoder", index.shtml" exists, shtml, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'subfolder', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
  it('/subfolder/third, third.htm exists, htm, should return true', () => {
    const result = handleHtml(req as Connect.IncomingMessage, res as ServerResponse, dataRoot, 'subfolder/third', logger);
    expect(result).toBeTruthy();
    expect(res.end).toBeCalled();
  });
});
