import { describe, it, expect } from 'vitest';

import { filter } from '../../../../handlers/handle-json/helpers/filter';

const data = [
  {
    id: 1,
    name: 'a',
    desc: 'a',
  },
  {
    id: 2,
    name: 'b',
    desc: 'b',
  },
  {
    id: 3,
    name: 'b',
    desc: 'c',
  },
];

describe('filter', () => {
  it('should has all', () => {
    const q = {
      qqq: 2,
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining(data));
    expect(result.length).toEqual(3);
  });
  it('should has all', () => {
    const q = {};
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining(data));
    expect(result.length).toEqual(3);
  });

  it('should has item #1', () => {
    const q = {
      id: 2,
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining(data.filter(({ id }) => id === 2)));
    expect(result.length).toEqual(1);
  });
  it('should has item #1 & #2', () => {
    const q = {
      name: 'b',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining(data.filter(({ name }) => name === 'b')));
    expect(result.length).toEqual(2);
  });
  it('should has item #2', () => {
    const q = {
      name: 'b',
      desc: 'b',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining(data.filter(({ name, desc }) => name === 'b' && desc === 'b')));
    expect(result.length).toEqual(1);
  });
  it('should be empty', () => {
    const q = {
      name: 'd',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining([]));
    expect(result.length).toEqual(0);
  });
});
