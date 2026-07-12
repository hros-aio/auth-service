import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '@new-hros/libs-core';

import { CacheManager } from './cache.service';

describe('CacheManager Namespace Logic', () => {
  let cacheManager: CacheManager;
  let cacheServiceMock: jest.Mocked<CacheService>;

  beforeEach(async () => {
    cacheServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      del: jest.fn(),
      flushNamespace: jest.fn(),
    } as unknown as jest.Mocked<CacheService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheManager,
        {
          provide: CacheService,
          useValue: cacheServiceMock,
        },
      ],
    }).compile();

    cacheManager = module.get<CacheManager>(CacheManager);
  });

  it('should prefix single key and retrieve the value from CacheService', async () => {
    // Arrange
    cacheServiceMock.get.mockResolvedValue('testValue');

    // Act
    const result = await cacheManager.get('user:1');

    // Assert
    expect(cacheServiceMock.get).toHaveBeenCalledWith('auth:user:1');
    expect(result).toBe('testValue');
  });

  it('should prefix key and set value in CacheService with TTL', async () => {
    // Act
    await cacheManager.set('user:1', 'testValue', 300);

    // Assert
    expect(cacheServiceMock.set).toHaveBeenCalledWith('auth:user:1', 'testValue', 300);
  });

  it('should delete prefixed key from CacheService', async () => {
    // Act
    await cacheManager.del('user:1');

    // Assert
    expect(cacheServiceMock.del).toHaveBeenCalledWith('auth:user:1');
  });

  it('should handle array deletion by prefixing all keys', async () => {
    // Act
    await cacheManager.del(['user:1', 'user:2']);

    // Assert
    expect(cacheServiceMock.del).toHaveBeenCalledWith(['auth:user:1', 'auth:user:2']);
  });
});
