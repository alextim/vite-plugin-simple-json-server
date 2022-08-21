import { ServerResponse } from 'node:http';
import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../utils/logger';
import { sendFileContent } from '../helpers/send-file-content';
import { handleOther } from '../handlers/handle-other';
import path from 'node:path';

const logger = new Logger('test');

const defReq = {
  url: '',
  method: 'GET',
};

const defRes = {
  statusCode: 0,
  end: vi.fn(),
};
let req;
let res;

vi.mock('../helpers/send-file-content', () => ({
  sendFileContent: vi.fn(),
}));

const reset = () => {
  req = { ...defReq };
  res = { ...defRes };
};

reset();
describe('test handleOther', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('path not exist, should return false', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, 'not-exist-index.html', logger);
    expect(result).toBeFalsy();
    expect(res.statusCode).toBe(0);
    expect(res.end).not.toBeCalled();
    expect(sendFileContent).not.toBeCalled();
  });
  it('path exists, not html, should return false', () => {
    const filepath = path.join(process.cwd(), '..', '..', 'examples', 'basic', 'index._html');
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, filepath, logger);
    expect(result).toBeFalsy();
    expect(res.statusCode).toBe(0);
    expect(res.end).not.toBeCalled();
    expect(sendFileContent).not.toBeCalled();
  });
  it('path exists, html, should return true', () => {
    const filepath = path.join(process.cwd(), '..', '..', 'examples', 'basic', 'index.html');
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, filepath, logger);
    expect(res.end).not.toBeCalled();
    expect(result).toBeTruthy();
    expect(sendFileContent).toBeCalled();
  });
});
