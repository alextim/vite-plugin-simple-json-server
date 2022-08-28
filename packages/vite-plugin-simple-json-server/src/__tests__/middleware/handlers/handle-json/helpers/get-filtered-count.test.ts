import { describe, it, expect } from 'vitest';

import { getFilteredCount } from '@/handlers/handle-json/helpers/get-filtered-count';

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

describe('getFilteredCount', () => {
  it('should has all', () => {
    const q = {
      qqq: 2,
    };
    expect(getFilteredCount(data, q)).toEqual(3);
  });
  it('should has all', () => {
    const q = {};
    expect(getFilteredCount(data, q)).toEqual(3);
  });

  it('should has item #1', () => {
    const q = {
      id: 2,
    };
    expect(getFilteredCount(data, q)).toEqual(1);
  });
  it('should has item #1 & #2', () => {
    const q = {
      name: 'b',
    };
    expect(getFilteredCount(data, q)).toEqual(2);
  });
  it('should has item #2', () => {
    const q = {
      name: 'b',
      desc: 'b',
    };
    expect(getFilteredCount(data, q)).toEqual(1);
  });
  it('should be empty', () => {
    const q = {
      name: 'd',
    };
    expect(getFilteredCount(data, q)).toEqual(0);
  });
});
