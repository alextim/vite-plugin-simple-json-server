import type { LogLevel, ResolvedConfig } from 'vite';
import { Plugin, Connect } from 'vite';
import path from 'node:path';
import type { ServerResponse } from 'node:http';

import Logger, { ILogger } from '@/services/logger';
import { isDirExists } from '@/utils/files';

import type { SimpleJsonServerPluginOptions, MockHandler, MockFunction } from './types';
import { PLUGIN_NAME } from './plugin-name';
import { validateOptions } from './validate-options';
import runMiddleware from './middleware/run-middleware';

export type { SimpleJsonServerPluginOptions, MockHandler, MockFunction, LogLevel };

let logger: ILogger;

const simpleJsonServerPlugin = (opts: SimpleJsonServerPluginOptions = {}): Plugin => {
  let config: ResolvedConfig;
  let mockRoot: string;
  let staticRoot: string;
  let options: SimpleJsonServerPluginOptions;

  return {
    name: PLUGIN_NAME,
    apply: 'serve',

    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
      options = validateOptions(opts);

      logger = new Logger(PLUGIN_NAME, options.logLevel);
      if (options.disable) {
        logger.info('disabled');
        return;
      }

      mockRoot = path.join(config.root, options.mockDir!);
      if (!isDirExists(mockRoot)) {
        logger.warn("Mock directory doesn't exist", mockRoot);
      }

      staticRoot = path.join(config.root, options.staticDir!);
      if (!isDirExists(staticRoot) && options.mockDir !== options.staticDir) {
        logger.warn("Static directory doesn't exist", staticRoot);
      }
    },

    configureServer(server) {
      if (options.disable) {
        return;
      }

      logger.info('server started.', `options = ${JSON.stringify(options, null, '  ')}`);
      server.middlewares.use(async (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        try {
          if (!(await runMiddleware(req, res, mockRoot, staticRoot, options, logger))) {
            next();
          }
        } catch (err: any) {
          server.ssrFixStacktrace(err);
          process.exitCode = 1;
          next(err);
        }
      });
    },

    configurePreviewServer(server) {
      if (options.disable) {
        return;
      }
      logger.info('server started.', `options = ${JSON.stringify(options, null, '  ')}`);
      server.middlewares.use(async (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        try {
          if (!(await runMiddleware(req, res, mockRoot, staticRoot, options, logger))) {
            next();
          }
        } catch (err: any) {
          logger.error(err.toString());
          process.exitCode = 1;
          next(err);
        }
      });
    },
  };
};

export default simpleJsonServerPlugin;
