import http, { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { JSON_MIME_TYPE } from '../utils/mime-types';
import formatResMsg from './format-res-msg';

export function validateMethod(req: Connect.IncomingMessage, res: ServerResponse, code = 403, allowedMethods = ['GET']) {
  if (!req.method || allowedMethods?.some((m) => m === req.method)) {
    return true;
  }
  const msg = code === 403 || code === 405 ? `${code} ${http.STATUS_CODES[code]}` : '';
  res.setHeader('Content-Type', JSON_MIME_TYPE);
  res.statusCode = code;
  res.end(JSON.stringify({ message: formatResMsg(req, msg) }));
  return false;
}
