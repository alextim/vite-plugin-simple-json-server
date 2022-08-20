import fs, { PathLike } from 'node:fs';

export function isDirExists(s: PathLike) {
  try {
    return fs.statSync(s).isDirectory();
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

export function isFileExists(s: PathLike) {
  try {
    return fs.statSync(s).isFile();
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}
