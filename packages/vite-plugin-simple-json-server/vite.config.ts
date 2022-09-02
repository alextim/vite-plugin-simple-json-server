/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { alias } from './alias';

export default defineConfig({
  plugins: [],
  build: {
    // to make tests faster
    minify: false,
  },
  resolve: {
    alias,
  },
  test: {
    globals: true,
  },
});
