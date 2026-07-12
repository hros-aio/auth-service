import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthServiceMock: jest.Mocked<HealthService>;
  let resMock: jest.Mocked<Response>;

  beforeEach(async () => {
    healthServiceMock = {
      checkAll: jest.fn(),
    } as unknown as jest.Mocked<HealthService>;

    resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<Response>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: healthServiceMock,
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  it('should return 200 and formatted healthy output when all health indicators are up', async () => {
    // Arrange
    const mockResult = {
      status: 'up' as const,
      components: {
        postgres: { status: 'up' },
        redis: { status: 'up' },
      },
    };
    healthServiceMock.checkAll.mockResolvedValue(mockResult);

    // Act
    await healthController.check(resMock);

    // Assert
    expect(healthServiceMock.checkAll).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      status: 'ok',
      info: {
        postgres: { status: 'up' },
        redis: { status: 'up' },
      },
      error: {},
      details: mockResult.components,
    });
  });

  it('should return 503 and error details when at least one health indicator is down', async () => {
    // Arrange
    const mockResult = {
      status: 'down' as const,
      components: {
        postgres: { status: 'up' },
        redis: { status: 'down', error: 'Redis timeout' },
      },
    };
    healthServiceMock.checkAll.mockResolvedValue(mockResult);

    // Act
    await healthController.check(resMock);

    // Assert
    expect(healthServiceMock.checkAll).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(503);
    expect(resMock.json).toHaveBeenCalledWith({
      status: 'error',
      info: {
        postgres: { status: 'up' },
      },
      error: {
        redis: { status: 'down', error: 'Redis timeout' },
      },
      details: mockResult.components,
    });
  });
});
