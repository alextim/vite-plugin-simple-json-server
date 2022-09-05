import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

import mock from 'mock-fs';

import Logger from '../../../../../../services/logger';
import { onPutPatchAll } from '../../../../../../middleware/handlers/handle-json/routes/all/put-patch';
import { dataRoot } from '../../../../../data-root';
import { IterableObject } from '../IterableObject';

const srcFilePath = path.join(dataRoot, 'object.json');
const srcContent = fs.readFileSync(srcFilePath, 'utf8');
const srcData = JSON.parse(srcContent);

const logger = new Logger('test');

let res: any;
class MockedRequest extends IterableObject {
  url = '';
  body = '';
  method = 'PUT';
  headers = {
    'content-type': 'application/json',
  };
}

const reset = () => {
  res = {
    req: {
      url: '',
      body: '',
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
    },
    setHeader: vi.fn(),
    statusCode: 0,
    end: vi.fn(),
  };
};

describe('onPutPatchAll', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
    mock.restore();
  });

  it('empty header, return true, 415', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req.headers = {};
    const result = await onPutPatchAll(res, filePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(415);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[415] }));
  });

  it('wrong content-type, return true, 415', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req.headers = { 'content-type': 'application/text' };
    const result = await onPutPatchAll(res, filePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(415);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[415] }));
  });

  it('not object, return true, 405', async () => {
    const filePath = path.join(dataRoot, 'array-empty.json');
    res.req = new MockedRequest('{"id":1}');
    const result = await onPutPatchAll(res, filePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[405] }));
  });

  it('empty body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('');
    const result = await onPutPatchAll(res, filePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Empty body' }));
  });

  it('large body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('a'.repeat(1e6 + 10));
    const result = await onPutPatchAll(res, filePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Request body exceeds 1e6' }));
  });

  it('Not valid json in body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('a'.repeat(10));
    const result = await onPutPatchAll(res, filePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Not valid json in body' }));
  });

  it('success PUT, return true, 200', async () => {
    const o = { x: 'y' };
    res.req = new MockedRequest(JSON.stringify(o));

    mock({
      [srcFilePath]: srcContent,
    });

    const result = await onPutPatchAll(res, srcFilePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(200);

    const content = fs.readFileSync(srcFilePath, 'utf8');
    const data = JSON.parse(content);

    expect(data).toEqual(o);
  });

  it('success PATCH, return true, 200', async () => {
    const o = { x: 'y' };
    res.req = new MockedRequest(JSON.stringify(o));
    res.req.method = 'PATCH';
    mock({
      [srcFilePath]: srcContent,
    });

    const result = await onPutPatchAll(res, srcFilePath, logger, res.req.method);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(200);

    const content = fs.readFileSync(srcFilePath, 'utf8');
    const data = JSON.parse(content);

    expect(data.id).toBe(srcData.id);
    expect(data.name).toBe(srcData.name);
    expect(data.x).toBe('y');
  });
});
