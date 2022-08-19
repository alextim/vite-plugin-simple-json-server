export const PLUGIN_NAME = 'vite-plugin-simple-json-server';

export type FileType = 'json' | 'html' | 'js' | 'css' | 'txt';

export const fileTypes: Record<FileType, string> = {
  html: 'text/html',
  json: 'application/json',
  js: 'text/javascript',
  css: 'text/css',
  txt: 'text/plain',
};
