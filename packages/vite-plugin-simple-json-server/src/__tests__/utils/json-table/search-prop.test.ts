import { describe, it, expect } from 'vitest';

import { searchProp } from '../../../utils/search-prop';

const item = {
  id: 1,
  name: 'a',
};

describe('searchProp', () => {
  it('key is absent, should return false', () => {
    const q = {
      qqq: 2,
    };
    expect(searchProp(item, q, Object.keys(q))).toBeFalsy();
  });
  it('empty q, should return true', () => {
    const q = {};
    expect(searchProp(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=2, should return false', () => {
    const q = {
      id: 2,
    };
    expect(searchProp(item, q, Object.keys(q))).toBeFalsy();
  });

  it('id=[2,3], should return false', () => {
    const q = {
      id: [2, 3],
    };
    expect(searchProp(item, q, Object.keys(q))).toBeFalsy();
  });

  it('id=1, should return true', () => {
    const q = {
      id: 1,
    };
    expect(searchProp(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=[1,2], should return true', () => {
    const q = {
      id: [1, 2],
    };
    expect(searchProp(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=1, name=a, should return true', () => {
    const q = {
      id: 1,
      name: 'a',
    };
    expect(searchProp(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=[1,2], name=[a,b] should return true', () => {
    const q = {
      id: [1, 2],
      name: ['a', 'b'],
    };
    expect(searchProp(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=1, name=a, should return false', () => {
    const q = {
      id: 1,
      qq: 'x',
    };
    expect(searchProp(item, q, Object.keys(q))).toBeFalsy();
  });
});
