import { describe, it, expect, beforeEach } from 'vitest';
import { sortDeep as sort } from '../../utils/comp-properties-of-deep';

let src: any[];

describe('sort', () => {
  beforeEach(() => {
    src = [
      { id: 0, name: 'b', d: { id: 0, name: 'b' } },
      { id: 4, name: 'c', d: { id: 4, name: 'c' } },
      { id: 1, name: 'a', d: { id: 1, name: 'a' } },
      { id: 3, name: 'a', d: { id: 3, name: 'a' } },
      { id: 2, name: 'c', d: { id: 2, name: 'c' } },
    ];
  });

  it('name, should be "a"', () => {
    sort(src, 'name');
    expect(src[0].name).toBe('a');
    expect(src[1].name).toBe('a');
    expect(src[2].name).toBe('b');
    expect(src[3].name).toBe('c');
    expect(src[4].name).toBe('c');
  });
  it('-id, should be 4', () => {
    sort(src, '-id');
    expect(src[0].id).toBe(4);
    expect(src[1].id).toBe(3);
    expect(src[2].id).toBe(2);
    expect(src[3].id).toBe(1);
    expect(src[4].id).toBe(0);
  });
  it('-name, should be "c"', () => {
    sort(src, '-name');
    expect(src[0].name).toBe('c');
    expect(src[1].name).toBe('c');
    expect(src[2].name).toBe('b');
    expect(src[3].name).toBe('a');
    expect(src[4].name).toBe('a');
  });
  it('name, id, should be 1', () => {
    sort(src, 'name', 'id');
    expect(src[0].id).toBe(1);
    expect(src[1].id).toBe(3);
    expect(src[2].id).toBe(0);
    expect(src[3].id).toBe(2);
    expect(src[4].id).toBe(4);
  });
  it('-name, id, should be 1', () => {
    sort(src, '-name', 'id');
    expect(src[0].id).toBe(2);
    expect(src[1].id).toBe(4);
    expect(src[2].id).toBe(0);
    expect(src[3].id).toBe(1);
    expect(src[4].id).toBe(3);
  });
  it('name, -id, should be 1', () => {
    sort(src, 'name', '-id');
    expect(src[0].id).toBe(3);
    expect(src[1].id).toBe(1);
    expect(src[2].id).toBe(0);
    expect(src[3].id).toBe(4);
    expect(src[4].id).toBe(2);
  });

  /**
   * deep
   */
  it('d.name, should be "a"', () => {
    sort(src, 'd.name');
    expect(src[0].name).toBe('a');
    expect(src[1].name).toBe('a');
    expect(src[2].name).toBe('b');
    expect(src[3].name).toBe('c');
    expect(src[4].name).toBe('c');
  });
  it('-d.id, should be 4', () => {
    sort(src, '-d.id');
    expect(src[0].id).toBe(4);
    expect(src[1].id).toBe(3);
    expect(src[2].id).toBe(2);
    expect(src[3].id).toBe(1);
    expect(src[4].id).toBe(0);
  });
  it('-d.name, should be "c"', () => {
    sort(src, '-d.name');
    expect(src[0].name).toBe('c');
    expect(src[1].name).toBe('c');
    expect(src[2].name).toBe('b');
    expect(src[3].name).toBe('a');
    expect(src[4].name).toBe('a');
  });
  it('d.name, d.id, should be 1', () => {
    sort(src, 'd.name', 'd.id');
    expect(src[0].id).toBe(1);
    expect(src[1].id).toBe(3);
    expect(src[2].id).toBe(0);
    expect(src[3].id).toBe(2);
    expect(src[4].id).toBe(4);
  });
  it('-d.name, d.id, should be 1', () => {
    sort(src, '-d.name', 'd.id');
    expect(src[0].id).toBe(2);
    expect(src[1].id).toBe(4);
    expect(src[2].id).toBe(0);
    expect(src[3].id).toBe(1);
    expect(src[4].id).toBe(3);
  });
  it('d.name, -d.id, should be 1', () => {
    sort(src, 'd.name', '-d.id');
    expect(src[0].id).toBe(3);
    expect(src[1].id).toBe(1);
    expect(src[2].id).toBe(0);
    expect(src[3].id).toBe(4);
    expect(src[4].id).toBe(2);
  });
});
