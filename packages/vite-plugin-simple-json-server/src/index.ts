import type { LogLevel, ResolvedConfig } from 'vite';
import { Plugin, Connect } from 'vite';
import path from 'node:path';
import type { ServerResponse } from 'node:http';

import Logger, { ILogger } from '@/utils/logger';
import { isDirExists } from '@/utils/files';

import type { SimpleJsonServerPluginOptions, MockHandler, MockFunction } from './types';
import { PLUGIN_NAME } from './plugin-name';
import { validateOptions } from './validate-options';
import doHandle from './do-handle';

export type { SimpleJsonServerPluginOptions, MockHandler, MockFunction, LogLevel };

let logger: ILogger;

const simpleJsonServerPlugin = (opts: SimpleJsonServerPluginOptions = {}): Plugin => {
  let config: ResolvedConfig;
  let dataRoot: string;

  return {
    name: PLUGIN_NAME,

    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
    },

    async configureServer(devServer) {
      const options = validateOptions(opts);

      logger = new Logger(PLUGIN_NAME, options.logLevel);

      dataRoot = path.join(config.root, options.mockRootDir!);
      if (!isDirExists(dataRoot)) {
        logger.warn("Mock directory doesn't exist", dataRoot);
      }

      logger.info('mock server started.', `options = ${JSON.stringify(options, null, '  ')}`);

      devServer.middlewares.use(async (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        try {
          if (!(await doHandle(req, res, dataRoot, options, logger))) {
            next();
          }
        } catch (err: any) {
          devServer.ssrFixStacktrace(err);
          process.exitCode = 1;
          next(err);
        }
      });
    },
  };
};

export default simpleJsonServerPlugin;
