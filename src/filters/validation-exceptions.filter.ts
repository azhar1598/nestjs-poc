import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ValidationExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if it's a validation error
    if (
      !exception.response ||
      !exception.response.message ||
      !Array.isArray(exception.response.message)
    ) {
      throw exception;
    }

    const isValidationError = exception.response.message.some(
      (item: any) => typeof item === 'object' && item.constraints,
    );

    if (!isValidationError) {
      throw exception;
    }

    const validationErrors = this.formatValidationErrors(
      exception.response.message,
    );

    this.logger.warn(`Validation error: ${JSON.stringify(validationErrors)}`);

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: validationErrors,
      timestamp: new Date().toISOString(),
    });
  }

  private formatValidationErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints || {});
      return acc;
    }, {});
  }
}
