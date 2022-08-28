import { defineConfig } from 'vite';
import jsonServer from 'vite-plugin-simple-json-server';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/aaaa/',
  server: {
    https: true,
  },
  plugins: [
    basicSsl(),
    jsonServer({
      handlers: [
        {
          pattern: '/api/home',
          method: 'GET',
          handle: (req, res) => {
            const data = {
              a: 1,
              b: 2,
              c: 'c',
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
        },
        {
          pattern: '/api/lines',
          handle: (req, res) => {
            const data = {
              d: 4,
              f: 'f',
              g: 6,
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
        },
      ],
    }),
  ],
});
