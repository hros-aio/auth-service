import 'reflect-metadata';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

import { configurationLoader } from './configuration';
import { validate } from './env.validation';

describe('Configuration Loader & Validator', () => {
  const tempConfigPath = join(process.cwd(), 'config', 'config.local.yaml');

  beforeAll(() => {
    // Write temporary local config for test
    writeFileSync(tempConfigPath, 'PORT: 9999\nDB_HOST: "local-db"', 'utf8');
  });

  afterAll(() => {
    // Cleanup temporary local config
    try {
      unlinkSync(tempConfigPath);
    } catch (_) {
      // Ignore
    }
  });

  describe('configurationLoader()', () => {
    it('should load configuration values from config files and override with environment variables', () => {
      // Arrange
      process.env.DB_HOST = 'env-db';

      // Act
      const result = configurationLoader();

      // Assert
      expect(result.PORT).toBe(9999);
      expect(result.DB_HOST).toBe('env-db');

      // Cleanup env
      delete process.env.DB_HOST;
    });
  });

  describe('validate()', () => {
    it('should validate and narrow successfully when all required fields are present', () => {
      // Arrange
      const mockConfig = {
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'user',
        DB_PASSWORD: 'password',
        DB_NAME: 'db',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        JWT_PUBLIC_KEY: 'test-key',
      };

      // Act
      const validated = validate(mockConfig);

      // Assert
      expect(validated.DB_PORT).toBe(5432);
      expect(validated.DB_HOST).toBe('localhost');
    });

    it('should throw an error when required configuration fields are missing', () => {
      // Arrange
      const invalidConfig = {
        PORT: 3000,
      };

      // Act & Assert
      expect(() => validate(invalidConfig)).toThrow();
    });
  });
});
