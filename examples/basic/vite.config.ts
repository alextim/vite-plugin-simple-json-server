import { defineConfig } from 'vite';
import jsonServer from 'vite-plugin-simple-json-server';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/aaaa/',
  plugins: [
    jsonServer({
      urlPrefixes: ['/api/'],
      staticDir: 'static',
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
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(data));
          },
        },
      ],
    }),
  ],
});
