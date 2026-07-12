import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { of, Observable } from 'rxjs';

import { ContextManager } from './context.manager';
import { ContextMiddleware } from './context.middleware';
import { AppLogger } from './logger.wrapper';
import { LoggingInterceptor } from './logging.interceptor';

describe('Context & Logging Pipeline', () => {
  describe('LoggingInterceptor', () => {
    let interceptor: LoggingInterceptor;
    let loggerMock: jest.Mocked<AppLogger>;

    beforeEach(async () => {
      loggerMock = {
        info: jest.fn(),
      } as unknown as jest.Mocked<AppLogger>;

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LoggingInterceptor,
          {
            provide: AppLogger,
            useValue: loggerMock,
          },
        ],
      }).compile();

      interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
    });

    it('should log request started on execution and completed on exit', async () => {
      // Arrange
      const reqMock = { method: 'POST', url: '/api/v1/auth/login' };
      const resMock = { statusCode: 201 };
      const contextMock = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switchToHttp: (): any => ({
          getRequest: (): unknown => reqMock,
          getResponse: (): unknown => resMock,
        }),
      } as unknown as ExecutionContext;

      const nextMock = {
        handle: (): Observable<string> => of('response_data'),
      } as unknown as CallHandler;

      // Act
      const observable = interceptor.intercept(contextMock, nextMock);
      await new Promise((resolve) => observable.subscribe(resolve));

      // Assert
      expect(loggerMock.info).toHaveBeenCalledWith(
        'HTTP Request Started: POST /api/v1/auth/login',
        'LoggingInterceptor',
      );
      expect(loggerMock.info).toHaveBeenCalledWith(
        expect.stringContaining('HTTP Request Completed: POST /api/v1/auth/login | Status: 201'),
        'LoggingInterceptor',
      );
    });
  });

  describe('ContextMiddleware', () => {
    let middleware: ContextMiddleware;
    let contextManager: ContextManager;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [ContextMiddleware, ContextManager],
      }).compile();

      middleware = module.get<ContextMiddleware>(ContextMiddleware);
      contextManager = module.get<ContextManager>(ContextManager);
    });

    it('should extract correlation headers and run callback in AsyncLocalStorage scope', (done) => {
      // Arrange
      const reqMock = {
        headers: {
          'x-request-id': 'req-123',
          'x-tenant-code': 'tenant-abc',
          'x-user-id': 'user-456',
        },
      } as unknown as Request;

      const resMock = {
        setHeader: jest.fn(),
      } as unknown as Response;

      const nextMock = jest.fn(() => {
        // Assert: correlation params should be bound inside async context scope
        expect(contextManager.requestId).toBe('req-123');
        expect(contextManager.tenantCode).toBe('tenant-abc');
        expect(contextManager.userId).toBe('user-456');
        done();
      }) as NextFunction;

      // Act
      middleware.use(reqMock, resMock, nextMock);
    });
  });
});
