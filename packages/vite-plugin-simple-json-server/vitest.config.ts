import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const alias = {
  '@/utils': path.resolve(__dirname, 'src', 'utils'),
  '@/helpers': path.resolve(__dirname, 'src', 'helpers'),
  '@/handlers': path.resolve(__dirname, 'src', 'middleware', 'handlers'),
};

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias,
  },
});
