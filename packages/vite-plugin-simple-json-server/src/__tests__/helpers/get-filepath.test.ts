import path from 'node:path';

import { describe, it, expect } from 'vitest';

import getFilepath from '../../helpers/get-filepath';
import { HTML_MIME_TYPE } from '../../utils/mime-types';

import { dataRoot } from '../data-root';

describe('getFilepath', () => {
  it('folder with pathname exists, should return index.html', () => {
    const pathname = dataRoot;
    const expected = path.join(pathname, 'index.html');
    const result = getFilepath(pathname, HTML_MIME_TYPE);
    expect(result).toBe(expected);
  });
  it('subfolder & index.shtml exists should return index.shtml', () => {
    const pathname = path.join(dataRoot, 'subfolder');
    const expected = path.join(dataRoot, 'subfolder', 'index.shtml');
    const result = getFilepath(pathname, HTML_MIME_TYPE);
    expect(result).toBe(expected);
  });
  it('subfolder & index.shtml exists should return index.shtml', () => {
    const pathname = path.join(dataRoot, 'subfolder', 'index.shtml');
    const result = getFilepath(pathname, HTML_MIME_TYPE);
    expect(result).toBe(pathname);
  });
  it('subfolder & third.htm exists, should return third.htm', () => {
    const pathname = path.join(dataRoot, 'subfolder', 'third');
    const expected = pathname + '.htm';
    const result = getFilepath(pathname, HTML_MIME_TYPE);
    expect(result).toBe(expected);
  });
  it('subfolder & third.htm 2, should return third.htm', () => {
    const pathname = path.join(dataRoot, 'subfolder', 'third.htm');
    const result = getFilepath(pathname, HTML_MIME_TYPE);
    expect(result).toBe(pathname);
  });

  it('source.js, should return source.js', () => {
    const pathname = path.join(dataRoot, 'source.js');
    const result = getFilepath(pathname, 'text/javascript');
    expect(result).toBe(pathname);
  });
  it('source.js, should return source.js', () => {
    const pathname = path.join(dataRoot, 'subfolder', 'source.js');
    const result = getFilepath(pathname, 'text/javascript');
    expect(result).toBe(pathname);
  });

  it('source.js, other mime, should return ""', () => {
    const pathname = path.join(dataRoot, 'source.js');
    const result = getFilepath(pathname, HTML_MIME_TYPE);
    expect(result).toBe('');
  });
  it('source.js, other mime, should return ""', () => {
    const pathname = path.join(dataRoot, 'subfolder', 'source.js');
    const result = getFilepath(pathname, HTML_MIME_TYPE);
    expect(result).toBe('');
  });
});
