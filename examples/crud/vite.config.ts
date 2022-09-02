import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsonServer from 'vite-plugin-simple-json-server';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr(), react(), jsonServer()],
  build: {
    minify: false,
  },
});
