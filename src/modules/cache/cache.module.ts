import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule as CoreCacheModule } from '@new-hros/libs-core';

import { CacheManager } from './cache.service';

@Module({
  imports: [
    CoreCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        l1DefaultTtl: 300,
        l1MaxItems: 10000,
        redis: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD'),
          keyPrefix: 'hrms:',
        },
      }),
    }),
  ],
  providers: [CacheManager],
  exports: [CacheManager],
})
export class CacheModule {}
