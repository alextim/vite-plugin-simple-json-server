import { SIMPLE_JSON_SERVER_CONFIG_DEFAULTS } from './config-defaults';
import { SimpleJsonServerPluginOptions } from './types';
import { addSlashes } from './utils/misc';

export const validateOptions = (options: SimpleJsonServerPluginOptions) => {
  const opts: SimpleJsonServerPluginOptions = {};
  opts.disable = options.disable ?? SIMPLE_JSON_SERVER_CONFIG_DEFAULTS.disable;
  opts.logLevel = options.logLevel || SIMPLE_JSON_SERVER_CONFIG_DEFAULTS.logLevel;

  const urlPrefixes = Array.isArray(options.urlPrefixes) ? options.urlPrefixes.filter(Boolean).map(addSlashes) : [];
  opts.urlPrefixes = urlPrefixes.length ? urlPrefixes : SIMPLE_JSON_SERVER_CONFIG_DEFAULTS.urlPrefixes;

  opts.mockDir = options.mockDir || SIMPLE_JSON_SERVER_CONFIG_DEFAULTS.mockDir;
  opts.staticDir = options.staticDir || opts.mockDir;
  opts.noHandlerResponse404 = options.noHandlerResponse404 ?? SIMPLE_JSON_SERVER_CONFIG_DEFAULTS.noHandlerResponse404;
  opts.limit = options.limit || SIMPLE_JSON_SERVER_CONFIG_DEFAULTS.limit;
  opts.handlers = options?.handlers?.filter(({ pattern, handle }) => pattern && handle);
  return opts;
};
