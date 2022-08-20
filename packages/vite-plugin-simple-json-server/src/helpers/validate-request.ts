import { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import formatResMsg from './format-res-msg';

export function validateReq({ url, method }: Connect.IncomingMessage, res: ServerResponse, code = 403, methods?: string[]) {
  if (!method || method === 'GET') {
    return true;
  }
  if (method === 'HEAD') {
    res.statusCode = 200;
    res.end(formatResMsg('Skipped', url, method));
    return false;
  }
  if (methods?.some((m) => m === method)) {
    return true;
  }
  res.statusCode = code;
  let msg: string;
  switch (code) {
    case 405:
      msg = '405 Not Allowed';
      break;
    case 403:
      msg = '403 Forbidden';
      break;
    default:
      msg = '';
      break;
  }
  res.end(formatResMsg(msg, url, method));
  return false;
}
