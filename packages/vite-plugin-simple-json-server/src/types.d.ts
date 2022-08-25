import { ServerResponse } from 'node:http';
import { Connect, LogLevel } from 'vite';

export type MockFunction = {
  (req: Connect.IncomingMessage, res: ServerResponse, urlVars?: Record<string, string>): void;
};

export type MockHandler = {
  pattern: string;
  method?: string;
  handle: MockFunction;
};

export type SimpleJsonServerPluginOptions = {
  disable?: boolean;
  logLevel?: LogLevel;
  urlPrefixes?: string[];
  handlers?: MockHandler[];
  mockRootDir?: string;
  noHandlerResponse404?: boolean;
  limit?: number;
};
