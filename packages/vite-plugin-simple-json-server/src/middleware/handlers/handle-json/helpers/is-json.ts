import { Connect } from 'vite';

export const isJson = (req: Connect.IncomingMessage) => {
  if (!req.headers) {
    return false;
  }
  const keys = Object.keys(req.headers);
  const key = keys.find((key) => key.toLocaleLowerCase() === 'content-type');
  if (!key) {
    return false;
  }
  return req.headers[key]!.includes('application/json');
};
