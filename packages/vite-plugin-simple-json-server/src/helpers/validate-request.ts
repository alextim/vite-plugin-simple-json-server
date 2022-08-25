import http, { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import formatResMsg from './format-res-msg';

export function validateReq(req: Connect.IncomingMessage, res: ServerResponse, code = 403, allowedMethods = ['GET']) {
  if (!req.method || allowedMethods?.some((m) => m === req.method)) {
    return true;
  }
  const msg = code === 403 || code === 405 ? `${code} ${http.STATUS_CODES[code]}` : '';
  res.statusCode = code;
  res.end(formatResMsg(req, msg));
  return false;
}
