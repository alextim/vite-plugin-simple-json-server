import { describe, it, expect } from 'vitest';

import { getNames } from '../../../../handlers/handle-json/helpers/get-names';

const item = {
  id: 1,
  name: 'name',
};
describe('test getNames', () => {
  it('should has id and not extra', () => {
    const q = {
      id: 1,
      extra: 2,
      limit: 10,
    };
    expect(getNames(q, item)).toEqual(expect.arrayContaining(['id']));
  });
});
