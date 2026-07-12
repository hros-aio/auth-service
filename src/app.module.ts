import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApisModule } from '@new-hros/libs-apis';
import { CoreModule } from '@new-hros/libs-core';
import { SqlModule } from '@new-hros/libs-sql';

import { ConfigurationModule } from './modules/config/config.module';
import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Global()
@Module({
  providers: [
    {
      provide: Number,
      useValue: 5000,
    },
  ],
  exports: [Number],
})
export class GlobalNumberModule {}

@Module({
  imports: [
    ConfigurationModule,
    GlobalNumberModule,
    CoreModule.forRoot({
      cache: {
        store: 'redis',
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      },
    }),
    ApisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        auth: {
          publicKey: config.get<string>('JWT_PUBLIC_KEY'),
        },
      }),
    }),
    HealthModule,
    MetricsModule,
    SqlModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class AppModule {}
