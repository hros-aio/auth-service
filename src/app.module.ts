import { Module } from '@nestjs/common';
import { ApisModule } from '@new-hros/libs-apis';
import { ConfigurationModule, ConfigurationService, CoreModule } from '@new-hros/libs-core';
import { SqlModule } from '@new-hros/libs-sql';

import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    ConfigurationModule.register({ configDir: 'config' }),
    CoreModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        cache: {
          store: 'redis',
          host: config.get<string>('redis.host') ?? 'localhost',
          port: config.get<number>('redis.port') ?? 6379,
        },
      }),
    }),
    ApisModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        auth: {
          publicKey: config.get<string>('jwt.publicKey'),
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
