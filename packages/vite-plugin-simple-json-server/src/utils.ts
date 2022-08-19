import fs from 'node:fs';
import { ServerResponse } from 'node:http';
import { ILogger } from './logger';

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

export function addSlashes(s: string) {
  if (!s.startsWith('/')) {
    s = `/${s}`;
  }
  if (!s.endsWith('/')) {
    s = `${s}/`;
  }
  return s;
}

export function sendFileContent(res: ServerResponse, filePath: string, mime: string, logger: ILogger) {
  logger.info('matched', `file: ${filePath}`);

  const data = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', mime);
  res.end(data);
}

export function removeTrailingSlash(s: string) {
  return s.endsWith('/') ? s.substring(0, s.length - 1) : s;
}
