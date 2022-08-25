import { SimpleJsonServerPluginOptions } from './types';

export const SIMPLE_JSON_SERVER_CONFIG_DEFAULTS: SimpleJsonServerPluginOptions = {
  logLevel: 'info',
  urlPrefixes: ['/api/'],
  mockRootDir: 'mock',
  noHandlerResponse404: true,
  limit: 10,
  disable: false,
};
