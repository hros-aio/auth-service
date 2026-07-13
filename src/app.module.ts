import fs from 'fs';
import path from 'path';

import { Module } from '@nestjs/common';
import { ApisModule } from '@new-hros/libs-apis';
import { ConfigurationModule, ConfigurationService, CoreModule } from '@new-hros/libs-core';
import { SqlModule } from '@new-hros/libs-sql';

import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';

// Load local .env file if available (Node.js 20.12+)
if (typeof process.loadEnvFile === 'function') {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
}

const config = new ConfigurationService({});

@Module({
  imports: [
    ConfigurationModule.register({ configDir: 'config' }),
    CoreModule.forRoot({
      cache: {
        store: 'redis',
        host: config.get<string>('redis.host') ?? 'localhost',
        port: config.get<number>('redis.port') ?? 6379,
      },
    }),
    ApisModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        auth: {
          publicKey: config.get<string>('jwt.publicKey'),
          privateKey: config.get<string>('jwt.privateKey'),
        },
      }),
    }),
    HealthModule,
    MetricsModule,
    SqlModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        type: 'postgres' as const,
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class AppModule {}
