import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

import mock from 'mock-fs';

import Logger from '../../../../../../services/logger';
import { onDelete } from '../../../../../../middleware/handlers/handle-json/routes/{id}/delete';
import { dataRoot } from '../../../../../data-root';

const srcFilePath = path.join(dataRoot, 'array-has-id.json');
const srcContent = fs.readFileSync(srcFilePath, 'utf8');
const srcData = JSON.parse(srcContent);

const logger = new Logger('test');

let res: any;

const reset = () => {
  res = {
    req: {
      url: '',
      body: '',
      method: 'DELETE',
    },
    setHeader: vi.fn(),
    statusCode: 0,
    end: vi.fn(),
  };
};

describe('onDelete', () => {
  beforeEach(reset);
  afterEach(() => {
    vi.clearAllMocks();
    mock.restore();
  });

  it('not array, return true, 404', async () => {
    const filePath = path.join(dataRoot, 'object-empty.json');
    const result = await onDelete(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
    expect(res.end).toBeCalledWith(JSON.stringify({ message: http.STATUS_CODES[404] + ', Not array' }));
  });

  it('empty data, return true, 404', async () => {
    const filePath = path.join(dataRoot, 'array-empty.json');

    const result = await onDelete(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
  });

  it('no id in data, return true, 404', async () => {
    const filePath = path.join(dataRoot, 'array-no-id.json');

    const result = await onDelete(res, filePath, logger, 2);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
  });

  it('not found in data, return true, 404', async () => {
    const filePath = path.join(dataRoot, 'array-has-id.json');

    const result = await onDelete(res, filePath, logger, 9);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(404);
  });

  it('success, return true, 204', async () => {
    const id = 2;

    mock({
      [srcFilePath]: srcContent,
    });

    const result = await onDelete(res, srcFilePath, logger, id);
    expect(result).toBeTruthy();
    expect(res.statusCode).toBe(204);

    const content = fs.readFileSync(srcFilePath, 'utf8');
    const data = JSON.parse(content);

    const compData = [...srcData];

    const index = (compData as any[]).findIndex((item: any) => item.id == id);

    compData.splice(index, 1);

    expect(data).toEqual(compData);
  });
});
