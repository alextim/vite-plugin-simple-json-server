import { defineConfig } from 'vitest/config';
import { alias } from './alias';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias,
  },
});
