import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

import mock from 'mock-fs';

import Logger from '../../../../../services/logger';
import { onPutPatch } from '../../../../../middleware/handlers/handle-json/routes/{id}/put-patch';
import { dataRoot } from '../../../../data-root';
import { IterableObject } from './IterableObject';

const srcFilePath = path.join(dataRoot, 'array-has-id.json');
const srcContent = fs.readFileSync(srcFilePath, 'utf8');

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

describe('onPutPatch', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
    mock.restore();
  });

  it('empty header, return true, 415', async () => {
    const filePath = path.join(dataRoot, 'array-empty.json');
    res.req.headers = {};
    const result = await onPutPatch(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(415);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[415] }));
  });

  it('wrong content-type, return true, 415', async () => {
    const filePath = path.join(dataRoot, 'array-empty.json');
    res.req.headers = { 'content-type': 'application/text' };
    const result = await onPutPatch(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(415);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[415] }));
  });

  it('not array, return true, 405', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('{"id":1}');
    const result = await onPutPatch(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(405);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[405] + ', Not array' }));
  });

  it('empty data, return true, 404', async () => {
    const filePath = path.join(dataRoot, 'array-empty.json');
    res.req = new MockedRequest('{"id":1}');
    const result = await onPutPatch(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
  });

  it('no id in data, return true, 404', async () => {
    const filePath = path.join(dataRoot, 'array-no-id.json');
    res.req = new MockedRequest('{"id":2}');
    const result = await onPutPatch(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
  });

  it('not found in data, return true, 404', async () => {
    const filePath = path.join(dataRoot, 'array-has-id.json');
    res.req = new MockedRequest('{"id":9}');
    const result = await onPutPatch(res, filePath, logger, 9);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
  });

  it('empty body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'array-has-id.json');
    res.req = new MockedRequest('');
    const result = await onPutPatch(res, filePath, logger, 1);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Empty body' }));
  });

  it('large body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'array-has-id.json');
    res.req = new MockedRequest('a'.repeat(1e6 + 10));
    const result = await onPutPatch(res, filePath, logger, 1);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Request body exceeds 1e6' }));
  });

  it('Not valid json in body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'array-has-id.json');
    res.req = new MockedRequest('a'.repeat(10));
    const result = await onPutPatch(res, filePath, logger, 1);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Not valid json in body' }));
  });

  it('success PUT, return true, 200', async () => {
    const id = 2;
    res.req = new MockedRequest('{"id":10000, "name":"x"}');
    mock({
      [srcFilePath]: srcContent,
    });

    const result = await onPutPatch(res, srcFilePath, logger, id);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(200);

    const content = fs.readFileSync(srcFilePath, 'utf8');
    const data = JSON.parse(content);

    expect(data[1].id).toBe(id);
    expect(data[1].name).toBe('x');
    expect(data[1].description).toBeUndefined();
  });

  it('success PATCH, return true, 200', async () => {
    const id = 2;
    res.req = new MockedRequest('{"id":10000, "name":"x"}');
    res.req.method = 'PATCH';
    mock({
      [srcFilePath]: srcContent,
    });

    const result = await onPutPatch(res, srcFilePath, logger, id, 'PATCH');
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(200);

    const content = fs.readFileSync(srcFilePath, 'utf8');
    const data = JSON.parse(content);

    expect(data[1].id).toBe(id);
    expect(data[1].name).toBe('x');
    expect(data[1].description).toBe('b');
  });
});
