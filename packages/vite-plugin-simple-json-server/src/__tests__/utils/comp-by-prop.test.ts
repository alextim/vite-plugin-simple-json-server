import { compByProp } from '@/utils/comp-by-prop';
import { describe, it, expect } from 'vitest';
import { DESC_ORDER } from '../../constants';

describe('compByProp', () => {
  const a = { p: 1 };
  const b = { p: 2 };

  it('0 (true', () => {
    expect(compByProp('x')(a, b) === 0).toBeTruthy();
  });

  it('a < b, result -1', () => {
    expect(compByProp('p')(a, b)).toBe(-1);
  });
  it('a < b desc, result  1', () => {
    expect(compByProp('p', DESC_ORDER)(a, b)).toBe(1);
  });

  it('a > b, result 1', () => {
    expect(compByProp('p')(b, a)).toBe(1);
  });
  it('a > b desc, result  -1', () => {
    expect(compByProp('p', DESC_ORDER)(b, a)).toBe(-1);
  });

  it('a = b, result  0 (true)', () => {
    expect(compByProp('p')(a, { p: 1 }) === 0).toBeTruthy();
  });
  it('a = b, desc result  0 (true)', () => {
    expect(compByProp('p', DESC_ORDER)(a, { p: 1 }) === 0).toBeTruthy();
  });
});
