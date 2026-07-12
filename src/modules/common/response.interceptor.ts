import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContextManager } from '../context/context.manager';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly contextManager: ContextManager) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const statusCode = response.statusCode;
    const requestId = this.contextManager.requestId;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        data: data !== undefined ? data : null,
        timestamp: new Date().toISOString(),
        requestId,
      })),
    );
  }
}
