export const JSON_MIME_TYPE = 'application/json';
export const HTML_MIME_TYPE = 'text/html';

export const supportedMimes: Record<string, string[]> = {
  [HTML_MIME_TYPE]: ['html', 'htm', 'shtml'],
  [JSON_MIME_TYPE]: ['json'],
  'text/javascript': ['js', 'mjs'],
  'text/css': ['css'],
  'text/plain': ['txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini'],
};

const mimes: Record<string, string> = Object.entries(supportedMimes).reduce(
  (all, [mime, exts]) => Object.assign(all, ...exts.map((ext) => ({ [ext]: mime }))),
  {},
);

const getMime = (ext: string) => mimes[ext]; //  || 'application/octet-stream';

export default getMime;
