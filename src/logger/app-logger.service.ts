import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logLevels: LogLevel[] = [
    'error',
    'warn',
    'log',
    'debug',
    'verbose',
  ];
  private logDir = path.join(process.cwd(), 'logs');

  constructor() {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  log(message: any, context?: string) {
    this.writeToConsole('log', message, context);
    this.writeToFile('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeToConsole('error', message, context, trace);
    this.writeToFile('error', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.writeToConsole('warn', message, context);
    this.writeToFile('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.writeToConsole('debug', message, context);
    this.writeToFile('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.writeToConsole('verbose', message, context);
    this.writeToFile('verbose', message, context);
  }

  private writeToConsole(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';

    // Use different colors for different log levels
    let consoleMethod: 'log' | 'error' | 'warn' | 'debug' = 'log';
    let color = '\x1b[0m'; // Reset color

    switch (level) {
      case 'error':
        consoleMethod = 'error';
        color = '\x1b[31m'; // Red
        break;
      case 'warn':
        consoleMethod = 'warn';
        color = '\x1b[33m'; // Yellow
        break;
      case 'debug':
        consoleMethod = 'debug';
        color = '\x1b[36m'; // Cyan
        break;
      case 'verbose':
        color = '\x1b[35m'; // Magenta
        break;
      default:
        color = '\x1b[32m'; // Green for info/log
    }

    console[consoleMethod](
      `${color}${timestamp} ${level.toUpperCase()} ${contextStr}${message}\x1b[0m`,
    );

    if (trace) {
      console.error(`\x1b[31m${trace}\x1b[0m`);
    }
  }

  private writeToFile(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    const logMessage = `${timestamp} ${level.toUpperCase()} ${contextStr}${message}${trace ? '\n' + trace : ''}\n`;

    const logFile = path.join(this.logDir, `${level}.log`);

    // Append to log file
    fs.appendFileSync(logFile, logMessage);
  }
}
