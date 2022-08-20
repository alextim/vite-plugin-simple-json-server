import { LogLevel } from 'vite';

export interface ILogger {
  info(...msg: string[]): void;
  success(...msg: string[]): void;
  warn(...msg: string[]): void;
  error(...msg: string[]): void;
}

export default class Logger implements ILogger {
  private colors = {
    reset: '\x1b[0m',
    fg: {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
    },
  } as const;

  private packageName: string;
  private logLevel: LogLevel;

  constructor(packageName: string, logLevel?: LogLevel) {
    this.packageName = packageName;
    this.logLevel = logLevel || 'info';
  }

  private log(msg: string[], prefix: string = '') {
    if (this.logLevel === 'silent') {
      return;
    }
    const s = msg.join('\n');
    // eslint-disable-next-line no-console
    console.log(`%s${this.packageName}:%s ${s}\n`, prefix, prefix ? this.colors.reset : '');
  }

  info(...msg: string[]) {
    if (this.logLevel === 'error') {
      return;
    }
    this.log(msg);
  }

  success(...msg: string[]) {
    if (this.logLevel === 'error') {
      return;
    }
    this.log(msg, this.colors.fg.green);
  }

  warn(...msg: string[]) {
    if (this.logLevel === 'error') {
      return;
    }
    this.log([...msg], this.colors.fg.yellow);
  }

  error(...msg: string[]) {
    this.log(['Failed!', ...msg], this.colors.fg.red);
  }
}
