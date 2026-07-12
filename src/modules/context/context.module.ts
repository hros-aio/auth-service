import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ContextManager } from './context.manager';
import { AppLogger } from './logger.wrapper';
import { LoggingInterceptor } from './logging.interceptor';
import { ResponseInterceptor } from '../common/response.interceptor';

@Global()
@Module({
  providers: [
    ContextManager,
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [ContextManager, AppLogger],
})
export class ContextModule {}
