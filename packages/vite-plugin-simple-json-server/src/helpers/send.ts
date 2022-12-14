import fs from 'node:fs';
import http, { ServerResponse } from 'node:http';

import { ILogger } from '../services/logger';
import { JSON_MIME_TYPE } from '../utils/mime-types';

export function sendFileContent(res: ServerResponse, filePath: string, mime: string, logger: ILogger) {
  const msg = [filePath];
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
    [`${statusCode} ${http.STATUS_CODES[statusCode]}`, ...(Array.isArray(msg) ? msg : [msg])],
    logger,
    statusCode,
  );
}

export function sendData(res: ServerResponse, data: any, msg: string[], logger: ILogger, statusCode = 200, mime = JSON_MIME_TYPE) {
  logger.info(`${res.req.method} ${res.req.url}`, ...msg.filter(Boolean));

  res.statusCode = statusCode;
  if (statusCode === 204) {
    // Safari (and potentially other browsers) need content-length 0,
    // for 204 or they just hang waiting for a body
    res.setHeader('Content-Length', '0');
    res.end();
  } else {
    if (!mime) {
      throw new Error("Please, provide 'mime'");
    }
    res.setHeader('content-type', mime);
    res.end(typeof data === 'string' ? data : JSON.stringify(data));
  }
  return true;
}

export function sendOptions(res: ServerResponse, options: string[], msg: string[], logger: ILogger) {
  return sendHeader(res, { Allow: options.join(',') }, msg, logger);
}

export function sendHeader(
  res: ServerResponse,
  header: Record<string, string | number | readonly string[]>,
  msg: string[],
  logger: ILogger,
  statusCode = 204,
) {
  logger.info(`${res.req.method} ${res.req.url}`, ...msg.filter(Boolean));
  Object.entries(header).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.statusCode = statusCode;
  res.end();
  return true;
}
