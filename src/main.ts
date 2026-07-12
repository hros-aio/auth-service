import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  setupSwagger,
  setupVersioning,
  createCorsOptions,
  GlobalHttpExceptionFilter,
  PlatformValidationPipe,
} from '@new-hros/libs-apis';

import { AppModule } from './app.module';
import { AppLogger } from './modules/context/logger.wrapper';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Configure CORS
  app.enableCors(createCorsOptions());

  // Configure API Versioning (MEDIA_TYPE versioning as per shared library implementation)
  setupVersioning(app, { defaultVersion: '1' });

  // Configure Global Filters and Pipes
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalPipes(new PlatformValidationPipe());

  // Configure Swagger Documentation
  setupSwagger(app, {
    enabled: true,
    title: 'HRMS Authentication Service',
    description: 'API documentation for the HRMS Authentication Service',
    version: '1.0.0',
    path: 'docs',
    bearerAuth: true,
  });

  // Enable Graceful Shutdown hooks
  app.enableShutdownHooks();

  await app.listen(port);
  logger.info(`Application is running on: http://localhost:${port}/docs`);
}

bootstrap();
