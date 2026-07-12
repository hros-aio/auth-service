import { Injectable } from '@nestjs/common';
import { HealthIndicator } from '@new-hros/libs-core';
import { ConfigurationService } from '@new-hros/libs-core';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator implements HealthIndicator {
  readonly name = 'redis';

  constructor(private readonly configService: ConfigurationService) {}

  async checkHealth(): Promise<{ status: 'up' | 'down'; details?: Record<string, unknown> }> {
    const host = this.configService.get<string>('redis.host') ?? 'localhost';
    const port = this.configService.get<number>('redis.port') ?? 6379;

    const client = new Redis({
      host,
      port,
      connectTimeout: 2000,
      maxRetriesPerRequest: 0,
    });

    try {
      await client.ping();
      await client.quit();
      return { status: 'up' };
    } catch (err: unknown) {
      try {
        client.disconnect();
      } catch (_) {
        // Ignore
      }
      return {
        status: 'down',
        details: { error: err instanceof Error ? err.message : String(err) },
      };
    }
  }
}
