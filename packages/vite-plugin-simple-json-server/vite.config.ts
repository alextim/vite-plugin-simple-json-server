import { defineConfig } from 'vite';

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
});
