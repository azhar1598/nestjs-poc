import {
  Controller,
  Get,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AppLoggerService } from './logger/app-logger.service';
import { CustomHttpException } from './exceptions/custom-http.exception';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('APP_LOGGER') private readonly logger: AppLoggerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-error')
  testError() {
    this.logger.warn('About to throw a test error');
    throw new HttpException('Test error', HttpStatus.BAD_REQUEST);
  }

  @Get('test-custom-error')
  testCustomError() {
    this.logger.warn('About to throw a custom test error');
    throw new CustomHttpException(
      'Custom test error',
      HttpStatus.BAD_REQUEST,
      'TEST_ERROR',
      { additionalInfo: 'This is a test' },
    );
  }

  @Get('test-unhandled')
  testUnhandledError() {
    this.logger.warn('About to throw an unhandled error');
    // This will be caught by the global exception filter
    throw new Error('This is an unhandled error');
  }
}
