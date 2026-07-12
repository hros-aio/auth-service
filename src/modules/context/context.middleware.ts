import { randomUUID } from 'crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { ContextManager } from './context.manager';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly contextManager: ContextManager) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId =
      (req.headers['x-request-id'] as string) ||
      (req.headers['x-correlation-id'] as string) ||
      randomUUID();
    const tenantCode = req.headers['x-tenant-code'] as string;
    const sessionId = req.headers['x-session-id'] as string;
    const userId = req.headers['x-user-id'] as string;
    const language = req.headers['x-language'] as string;
    const timezone = req.headers['x-timezone'] as string;

    // Set correlation headers in response
    res.setHeader('x-request-id', requestId);

    this.contextManager.run(
      {
        requestId,
        tenantCode,
        sessionId,
        userId,
        language,
        timezone,
      },
      () => next(),
    );
  }
}
