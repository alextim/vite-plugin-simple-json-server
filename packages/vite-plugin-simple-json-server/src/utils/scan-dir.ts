import fs from 'node:fs/promises';
import path from 'node:path';

export const scanDir = async (dir: string) => {
  const result: string[] = [];
  const items = await fs.readdir(dir);

  for (const item of items) {
    const pathname = path.join(dir, item);
    const stat = await fs.stat(pathname);
    if (stat.isDirectory()) {
      result.push(...(await scanDir(pathname)));
    }
    result.push(pathname);
  }
  return result;
};
