import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

import mock from 'mock-fs';

import Logger from '../../../../../../services/logger';
import { onPost } from '../../../../../../middleware/handlers/handle-json/routes/all/post';
import { dataRoot } from '../../../../../data-root';
import { IterableObject } from '../IterableObject';

const srcFilePath = path.join(dataRoot, 'array-has-id.json');
const srcContent = fs.readFileSync(srcFilePath, 'utf8');
const srcData = JSON.parse(srcContent);

const logger = new Logger('test');

let res: any;

class MockedRequest extends IterableObject {
  url = '/test';
  body = '';
  method = 'POST';
  headers = {
    'content-tYpe': 'application/json',
  };
}

const reset = () => {
  res = {
    req: {
      url: '/test',
      body: '',
      method: 'POST',
      headers: {
        'content-tYpe': 'application/json',
      },
    },
    statusCode: 0,
    setHeader: vi.fn(),
    hasHeader: vi.fn(),
    end: vi.fn(),
  };
};

describe('onPost', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
    mock.restore();
  });

  it('empty header, return true, 415', async () => {
    const filePath = path.join(dataRoot, 'array-empty.json');
    res.req.headers = {};
    const result = await onPost(res, filePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(415);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[415] }));
  });

  it('wrong content-type, return true, 415', async () => {
    const filePath = path.join(dataRoot, 'array-empty.json');
    res.req.headers = { 'content-type': 'application/text' };
    const result = await onPost(res, filePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(415);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[415] }));
  });

  it('empty body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('');
    const result = await onPost(res, filePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Empty body' }));
  });

  it('large body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('a'.repeat(1e6 + 10));
    const result = await onPost(res, filePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Request body exceeds 1e6' }));
  });

  it('Not valid json in body, return true, 400', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('a'.repeat(10));
    const result = await onPost(res, filePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(400);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[400] + ', Not valid json in body' }));
  });

  it('not array, return true, 201', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    res.req = new MockedRequest('{}');
    mock({
      [filePath]: '{}',
    });
    const result = await onPost(res, filePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(201);
    expect(res.end).toBeCalledWith('{}');
  });

  it('id already exists, return true, 409', async () => {
    const filePath = path.join(dataRoot, 'array-has-id.json');
    const id = 3;
    res.req = new MockedRequest(`{"id":${id}}`);
    const result = await onPost(res, filePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(409);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[409] + ', ' + `item with id=${id} already exists` }));
  });

  it('success, id not exists, return true, 201', async () => {
    const id = 9;
    res.req = new MockedRequest(`{"id":${id}}`);
    mock({
      [srcFilePath]: srcContent,
    });

    const result = await onPost(res, srcFilePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(201);

    const content = fs.readFileSync(srcFilePath, 'utf8');
    const data = JSON.parse(content);

    const compData = [...srcData, { id }];
    expect(data).toEqual(compData);
  });

  it('success, payload without id, return true, 201', async () => {
    res.req = new MockedRequest('{"name": "x"}');
    mock({
      [srcFilePath]: srcContent,
    });

    const result = await onPost(res, srcFilePath, logger);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(201);

    const content = fs.readFileSync(srcFilePath, 'utf8');
    const data = JSON.parse(content);

    const compData = [...srcData, { name: 'x', id: 7 }];
    expect(data).toEqual(compData);
  });
});
