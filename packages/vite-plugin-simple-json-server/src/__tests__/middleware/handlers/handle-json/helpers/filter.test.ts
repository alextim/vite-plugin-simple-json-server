import { describe, it, expect } from 'vitest';

import { filter } from '../../../../../middleware/handlers/handle-json/helpers/filter';

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

describe.only('filter', () => {
  it('should be 0', () => {
    const q = {
      qqq: 2,
    };
    const result = filter(data, q);
    expect(result.length === 0).toBeTruthy();
  });
  it('should be 0', () => {
    const q = {
      qqq: 2,
      id: '2',
    };
    const result = filter(data, q);
    expect(result.length === 0).toBeTruthy();
  });
  it('should be 0', () => {
    const q = {
      id: '4',
    };
    const result = filter(data, q);
    expect(result.length === 0).toBeTruthy();
  });

  it('should has all', () => {
    const q = {};
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining(data));
    expect(result.length).toBe(3);
  });

  it('should has item #2 & #3', () => {
    const q = {
      id: ['2', '3'],
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining((data as any[]).filter(({ id }) => id == '2' || id == '3')));
    expect(result.length).toBe(2);
  });
  it('should has item #2', () => {
    const q = {
      id: ['1', '2'],
      name: 'b',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining((data as any[]).filter(({ id, name }) => (id == '1' || id == '2') && name == 'b')));
    expect(result.length).toBe(1);
  });

  it('should has item #1', () => {
    const q = {
      id: '2',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining((data as any[]).filter(({ id }) => id == '2')));
    expect(result.length).toBe(1);
  });
  it('should has item #1 & #2', () => {
    const q = {
      name: 'b',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining((data as any[]).filter(({ name }) => name == 'b')));
    expect(result.length).toBe(2);
  });
  it('should has item #2', () => {
    const q = {
      name: 'b',
      description: 'b',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining((data as any[]).filter(({ name, description }) => name == 'b' && description == 'b')));
    expect(result.length).toBe(1);
  });
  it('should be empty', () => {
    const q = {
      name: 'd',
    };
    const result = filter(data, q);
    expect(result).toEqual(expect.arrayContaining([]));
    expect(result.length === 0).toBeTruthy();
  });
});
