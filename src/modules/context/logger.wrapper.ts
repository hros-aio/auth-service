import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { LoggerService as CoreLoggerService } from '@new-hros/libs-core';

import { ContextManager } from './context.manager';

@Injectable()
export class AppLogger extends CoreLoggerService implements NestLoggerService {
  constructor(private readonly contextManager: ContextManager) {
    super();
  }

  private logStructured(
    level: string,
    message: string,
    contextName?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalData?: any,
  ): void {
    const store = this.contextManager.getStore();
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: contextName,
      requestId: store?.requestId,
      tenantCode: store?.tenantCode,
      userId: store?.userId,
      sessionId: store?.sessionId,
      language: store?.language,
      timezone: store?.timezone,
      ...additionalData,
    };
    // Structured JSON log output to stdout/stderr
    if (level === 'error') {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(logEntry));
    } else if (level === 'warn') {
      // eslint-disable-next-line no-console
      console.warn(JSON.stringify(logEntry));
    } else {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(logEntry));
    }
  }

  debug(message: string, context?: string): void {
    this.logStructured('debug', message, context);
  }

  info(message: string, context?: string): void {
    this.logStructured('info', message, context);
  }

  log(message: string, context?: string): void {
    this.logStructured('info', message, context);
  }

  warn(message: string, context?: string): void {
    this.logStructured('warn', message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logStructured('error', message, context, { trace });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  audit(action: string, actor: string, details: any): void {
    this.logStructured('audit', `Audit Action: ${action}`, undefined, { action, actor, details });
  }

  security(
    event: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    details: any,
  ): void {
    this.logStructured('security', `Security Event: ${event} [${severity}]`, undefined, {
      event,
      severity,
      details,
    });
  }
}
