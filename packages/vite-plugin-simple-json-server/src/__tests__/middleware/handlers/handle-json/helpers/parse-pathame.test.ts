import { parsePathname } from '../../../../../middleware/handlers/handle-json/helpers/parse-pathname';

import { describe, it, expect } from 'vitest';

describe('purePath', () => {
  it('should return false', () => {
    const root = 'C:\\Users\\alex\\Documents\\Projects\\vite-plugin-simple-json-server\\examples\\basic\\mock';
    const purePath = 'subfolder/source.js';
    expect(parsePathname(root, purePath)).toBeFalsy();
  });
});
