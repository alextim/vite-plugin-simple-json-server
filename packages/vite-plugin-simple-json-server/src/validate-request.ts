import { ServerResponse } from 'node:http';
import { Connect } from 'vite';
import { PLUGIN_NAME } from './constants';

export function validateReq(req: Connect.IncomingMessage, res: ServerResponse, code = 403, methods?: string[]) {
  const method = req.method;

  if (!method || method === 'GET') {
    return true;
  }
  if (method === 'HEAD') {
    res.statusCode = 200;
    res.end('[' + PLUGIN_NAME + '] HEAD, { url: "' + req.url + '", method: "' + method + '" }');
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
  res.end('[' + PLUGIN_NAME + '] ' + msg + ', { url: "' + req.url + '", method: "' + method + '" }');
  return false;
}
