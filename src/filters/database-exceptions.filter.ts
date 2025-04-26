import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DatabaseExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if it's a database-related error
    const isDatabaseError =
      exception.code &&
      (exception.code.startsWith('22') || // Data exception
        exception.code.startsWith('23') || // Integrity constraint violation
        exception.code === '42P01'); // Undefined table

    if (!isDatabaseError) {
      // Let other filters handle non-database errors
      throw exception;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';

    // Map specific database errors to appropriate HTTP responses
    if (exception.code === '23505') {
      // Unique violation
      status = HttpStatus.CONFLICT;
      message = 'A record with this data already exists';
    } else if (exception.code === '23503') {
      // Foreign key violation
      status = HttpStatus.BAD_REQUEST;
      message = 'Referenced record does not exist';
    } else if (exception.code === '42P01') {
      // Undefined table
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database configuration error';
    }

    this.logger.error(
      `Database error: ${exception.code} - ${exception.message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
      timestamp: new Date().toISOString(),
    });
  }
}
