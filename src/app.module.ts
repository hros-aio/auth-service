import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqlModule } from '@new-hros/libs-sql';

import { CacheModule } from './modules/cache/cache.module';
import { ConfigurationModule } from './modules/config/config.module';
import { ContextMiddleware } from './modules/context/context.middleware';
import { ContextModule } from './modules/context/context.module';
import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    ConfigurationModule,
    ContextModule,
    CacheModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
