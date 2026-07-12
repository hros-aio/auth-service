import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppLogger } from './logger.wrapper';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const res = httpContext.getResponse();
    const { method, url } = req;
    const startTime = Date.now();

    this.logger.info(`HTTP Request Started: ${method} ${url}`, 'LoggingInterceptor');

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        this.logger.info(
          `HTTP Request Completed: ${method} ${url} | Status: ${statusCode} | Duration: ${duration}ms`,
          'LoggingInterceptor',
        );
      }),
    );
  }
}
