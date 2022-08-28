import { describe, it, expect } from 'vitest';

import { getParamNames } from '../../../../../middleware/handlers/handle-json/helpers/get-param-names';

describe('test getParamNames', () => {
  it('should has id and extra', () => {
    const q = {
      id: 1,
      extra: 2,
      limit: 10,
    };
    expect(getParamNames(q)).toEqual(expect.arrayContaining(['id', 'extra']));
  });
});
