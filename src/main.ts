import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger, setupVersioning, createCorsOptions } from '@new-hros/libs-apis';
import { ConfigurationService } from '@new-hros/libs-core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigurationService);
  const port = configService.get<number>('app.port') ?? 3000;

  // Configure CORS
  app.enableCors(createCorsOptions());

  // Configure API Versioning (MEDIA_TYPE versioning as per shared library implementation)
  setupVersioning(app, { defaultVersion: '1' });

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
  logger.log(`Application is running on: http://localhost:${port}/docs`);
}

bootstrap();
