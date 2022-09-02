import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const alias = {
  '@/utils': path.resolve(__dirname, 'src', 'utils'),
  '@/helpers': path.resolve(__dirname, 'src', 'helpers'),
  '@/services': path.resolve(__dirname, 'src', 'services'),
};
