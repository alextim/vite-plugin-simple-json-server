import { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import formatResMsg from './format-res-msg';

export function validateReq(req: Connect.IncomingMessage, res: ServerResponse, code = 403, allowedMethods = ['GET']) {
  if (!req.method || allowedMethods?.some((m) => m === req.method)) {
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
  res.end(formatResMsg(req, msg));
  return false;
}
