import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect } from 'vitest';

import checkPathname from '../../helpers/check-pathname';
import { HTML_MIME_TYPE } from '../../utils/mime-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '..', '..', '..', '..', '..', 'examples', 'basic', 'mock');

describe('checkPathname', () => {
  it('folder with pathname exists & mime=html, should return index.html', () => {
    const pathname = root;
    const expected = path.join(pathname, 'index.html');
    const result = checkPathname(pathname, HTML_MIME_TYPE);
    expect(result).toBe(expected);
  });
  it('folder with pathname exists & mime=html, should return index.htm', () => {
    const pathname = path.join(root, 'c');
    const expected = path.join(pathname, 'index.htm');
    const result = checkPathname(pathname, HTML_MIME_TYPE);
    expect(result).toBe(expected);
  });
  it('file with pathname exists & mime=html, should return ""', () => {
    const pathname = path.join(root, 'c', 'dd.shtml');
    const expected = '';
    const result = checkPathname(pathname, HTML_MIME_TYPE);
    expect(result).toBe(expected);
  });
});
