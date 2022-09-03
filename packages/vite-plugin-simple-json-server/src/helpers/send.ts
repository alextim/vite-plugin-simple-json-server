import fs from 'node:fs';
import http, { ServerResponse } from 'node:http';

import { ILogger } from '../services/logger';
import { JSON_MIME_TYPE } from '../utils/mime-types';

export function sendFileContent(res: ServerResponse, filePath: string, mime: string, logger: ILogger) {
  const msg = ['matched', `${res.req.method} ${res.req.url}`, filePath];
  const data = fs.readFileSync(filePath, 'utf-8');
  return sendData(res, data, msg, logger, 200, mime);
}

export function send400(res: ServerResponse, msg: string[] | string, logger: ILogger) {
  return sendError(res, msg, logger, 400);
}

export function send403(res: ServerResponse, msg: string[] | string, logger: ILogger) {
  return sendError(res, msg, logger, 403);
}

export function send404(res: ServerResponse, msg: string[] | string, logger: ILogger) {
  return sendError(res, msg, logger, 404);
}

export function send405(res: ServerResponse, msg: string[] | string, logger: ILogger) {
  return sendError(res, msg, logger, 405);
}

export function send409(res: ServerResponse, msg: string[] | string, logger: ILogger) {
  return sendError(res, msg, logger, 409);
}

export function send415(res: ServerResponse, msg: string[] | string, logger: ILogger) {
  return sendError(res, msg, logger, 415);
}

function sendError(res: ServerResponse, msg: string[] | string, logger: ILogger, statusCode: number) {
  let customMsg = Array.isArray(msg) ? msg[0] : msg;
  if (customMsg) {
    customMsg = `, ${customMsg}`;
  }
  return sendData(
    res,
    { message: `${http.STATUS_CODES[statusCode]}${customMsg}` },
    [`${statusCode} ${http.STATUS_CODES[statusCode]}`, `${res.req.method} ${res.req.url}`, ...(Array.isArray(msg) ? msg : [msg])],
    logger,
    statusCode,
  );
}

export function sendData(res: ServerResponse, data: any, msg: string[], logger: ILogger, statusCode = 200, mime = JSON_MIME_TYPE) {
  logger.info(...msg);

  res.setHeader('content-type', mime);
  res.statusCode = statusCode;
  if (statusCode === 204) {
    res.end();
  } else {
    res.end(typeof data === 'string' ? data : JSON.stringify(data));
  }
  return true;
}
