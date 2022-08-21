import { ServerResponse } from 'node:http';
import { Connect } from 'vite';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import Logger from '../utils/logger';
import { sendFileContent } from '../helpers/send-file-content';
import { handleOther } from '../handlers/handle-other';
import { isFileExists } from '../utils/files';

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
vi.mock('../utils/files', () => ({
  isFileExists: vi.fn().mockImplementation(() => true),
}));

reset();
describe('test handleOther', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('path not exist, should return false', () => {
    vi.mock('../utils/files', () => ({
      isFileExists: vi.fn().mockImplementation(() => false),
    }));
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, 'index.html', logger);
    expect(isFileExists).toBeCalled();
    expect(isFileExists).toHaveReturnedWith(false);
    expect(result).toBeFalsy();
    expect(res.statusCode).toBe(0);
    expect(res.end).not.toBeCalled();
    expect(sendFileContent).not.toBeCalled();
  });
  it('path exists, not html, should return false', () => {
    vi.mock('../utils/files', () => ({
      isFileExists: vi.fn().mockImplementation(() => true),
    }));
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, 'index._html', logger);
    expect(isFileExists).toBeCalled();
    expect(isFileExists).toHaveReturnedWith(true);
    expect(result).toBeFalsy();
    expect(res.statusCode).toBe(0);
    expect(res.end).not.toBeCalled();
    expect(sendFileContent).not.toBeCalled();
  });
  it('path exists, html, should return true', () => {
    const result = handleOther(req as Connect.IncomingMessage, res as ServerResponse, 'c:/index.html', logger);
    vi.mock('../utils/files', () => ({
      isFileExists: vi.fn().mockImplementation(() => true),
    }));
    expect(isFileExists).toBeCalled();
    expect(isFileExists).toHaveReturnedWith(true);
    expect(res.end).not.toBeCalled();
    expect(result).toBeTruthy();
    expect(sendFileContent).toBeCalled();
  });
});
