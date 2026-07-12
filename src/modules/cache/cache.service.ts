import { Injectable } from '@nestjs/common';
import { CacheService } from '@new-hros/libs-core';

@Injectable()
export class CacheManager {
  private readonly namespace = 'auth';

  constructor(private readonly cacheService: CacheService) {}

  private prefixKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cacheService.get<T>(this.prefixKey(key));
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    return this.cacheService.set<T>(this.prefixKey(key), value, ttlSeconds);
  }

  async has(key: string): Promise<boolean> {
    return this.cacheService.has(this.prefixKey(key));
  }

  async del(key: string | string[]): Promise<void> {
    if (Array.isArray(key)) {
      return this.cacheService.del(key.map((k) => this.prefixKey(k)));
    }
    return this.cacheService.del(this.prefixKey(key));
  }

  async flushAll(): Promise<void> {
    return this.cacheService.flushNamespace(`${this.namespace}:*`);
  }
}
