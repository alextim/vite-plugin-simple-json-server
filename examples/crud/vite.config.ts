import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsonServer from 'vite-plugin-simple-json-server';

export default defineConfig({
  plugins: [react(), jsonServer()],
  build: {
    minify: false,
  },
});
