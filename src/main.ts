import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Load environment variables first
  config();

  // Create a logger instance
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      // This ensures all logs are printed to the console
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Apply global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    // Create Swagger document
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Your API')
      .setDescription('Your API description')
      .setVersion('1.0')
      .addTag('users')
      .addBearerAuth() // Add this back if you need auth in Swagger
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    // Set up Scalar API Reference
    app.use(
      '/docs',
      apiReference({
        spec: {
          content: document,
        },
      }),
    );

    // Optional: Also serve the standard Swagger UI
    SwaggerModule.setup('api', app, document);

    // Global error handlers for uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error(`Uncaught Exception: ${error.message}`, error.stack);
      // Don't exit the process - let it continue running
    });

    process.on('unhandledRejection', (reason: any, promise) => {
      logger.error(
        `Unhandled Rejection at: ${promise}, reason: ${reason?.message || reason}`,
        reason?.stack,
      );
      // Don't exit the process - let it continue running
    });

    await app.listen(3000);
    logger.log('Application is running on: http://localhost:3000');
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`, error.stack);
    // Don't throw - this would crash the application
    // Instead, log the error and exit gracefully
    process.exit(1);
  }
}

bootstrap();
