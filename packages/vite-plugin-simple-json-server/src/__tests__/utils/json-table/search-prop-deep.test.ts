import { describe, it, expect } from 'vitest';

import { searchPropDeep } from '../../../utils/search-prop-deep';

const item = {
  id: 1,
  name: 'a',
  d: {
    b: 'bb',
    n: 11,
  },
};

describe('searchProp', () => {
  it('key is absent, should return false', () => {
    const q = {
      qqq: 2,
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });
  it('key is absent, should return false', () => {
    const q = {
      'd.x': 'bb',
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });

  it('empty q, should return true', () => {
    const q = {};
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });

  it('d.n=22, should return false', () => {
    const q = {
      'd.n': 22,
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });
  it('id=2, should return false', () => {
    const q = {
      id: 2,
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });

  it('id=[2,3], should return false', () => {
    const q = {
      id: [2, 3],
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });
  it('d.n=[22,33], should return false', () => {
    const q = {
      'd.n': [22, 33],
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });

  it('id=1, should return true', () => {
    const q = {
      id: 1,
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });
  it('d.n=11, should return true', () => {
    const q = {
      'd.n': 11,
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=[1,2], should return true', () => {
    const q = {
      id: [1, 2],
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });
  it('d.n=[11,22], should return true', () => {
    const q = {
      'd.n': [11, 22],
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=1, name=a, should return true', () => {
    const q = {
      id: 1,
      name: 'a',
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });
  it('d.n=11, d.b=bb, should return true', () => {
    const q = {
      'd.n': 11,
      'd.b': 'bb',
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=[1,2], name=[a,b] should return true', () => {
    const q = {
      id: [1, 2],
      name: ['a', 'b'],
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });
  it('d.n=[11,22], d.b=[a,bb] should return true', () => {
    const q = {
      'd.n': [11, 22],
      'd.b': ['a', 'bb'],
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeTruthy();
  });

  it('id=1, qq=x, should return false', () => {
    const q = {
      id: 1,
      qq: 'x',
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });
  it('d.n=11, d.x=x, should return false', () => {
    const q = {
      'd.n': 11,
      'd.x': 'x',
    };
    expect(searchPropDeep(item, q, Object.keys(q))).toBeFalsy();
  });
});
