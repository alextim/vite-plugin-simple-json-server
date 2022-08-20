import fs from 'node:fs';

export function isDirExists(s: string) {
  try {
    const stat = fs.statSync(s);
    return stat.isDirectory();
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

export function isFileExists(s: string) {
  try {
    const stat = fs.statSync(s);
    return stat.isFile();
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}
