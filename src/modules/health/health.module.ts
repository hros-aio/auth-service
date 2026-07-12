import { Module, OnModuleInit } from '@nestjs/common';
import { SqlHealthService, SqlModule } from '@new-hros/libs-sql';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RedisHealthIndicator } from './redis-health.indicator';

@Module({
  imports: [SqlModule],
  providers: [HealthService, RedisHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule implements OnModuleInit {
  constructor(
    private readonly healthService: HealthService,
    private readonly redisHealthIndicator: RedisHealthIndicator,
    private readonly sqlHealthService: SqlHealthService,
  ) {}

  onModuleInit(): void {
    this.healthService.registerIndicator(this.redisHealthIndicator);
    this.healthService.registerIndicator(this.sqlHealthService);
  }
}
