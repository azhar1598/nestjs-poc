import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      if (statusCode >= 400) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
        );
      }
    });

    next();
  }
}
