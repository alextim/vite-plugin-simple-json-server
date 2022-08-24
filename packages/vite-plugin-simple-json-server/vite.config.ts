import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // base: '/test.github.io/',
  plugins: [],
  /*
  optimizeDeps: {
    exclude: ['@react-three/fiber'],
  },
  */
  build: {
    // to make tests faster
    minify: false,
  },
  resolve: {
    alias: {
      '@/utils': path.resolve(__dirname, 'src', 'utils'),
      '@/helpers': path.resolve(__dirname, 'src', 'helpers'),
    },
  },
});
