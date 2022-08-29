import { describe, it, expect } from 'vitest';

import { getFilteredCount } from '../../../../../middleware/handlers/handle-json/helpers/get-filtered-count';

const data = [
  {
    id: 1,
    name: 'a',
    description: 'a',
  },
  {
    id: 2,
    name: 'b',
    description: 'b',
  },
  {
    id: 3,
    name: 'b',
    description: 'c',
  },
];

describe('getFilteredCount', () => {
  it('should has all', () => {
    const q = {
      qqq: 2,
    };
    const count = getFilteredCount(data, q);
    expect(count === 0).toBeTruthy();
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
      description: 'b',
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
