import { defineConfig } from 'vite';
import mockApi from 'vite-plugin-simple-json-server';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mockApi({
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
              e: 3,
              f: 4,
              g: 'g',
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
        },
      ],
    }),
  ],
});
