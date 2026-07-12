import { AsyncLocalStorage } from 'async_hooks';

import { Injectable } from '@nestjs/common';

export interface RequestContext {
  requestId: string;
  tenantCode?: string;
  sessionId?: string;
  userId?: string;
  language?: string;
  timezone?: string;
}

@Injectable()
export class ContextManager {
  private static readonly storage = new AsyncLocalStorage<RequestContext>();

  run<T>(context: RequestContext, callback: () => T): T {
    return ContextManager.storage.run(context, callback);
  }

  getStore(): RequestContext | undefined {
    return ContextManager.storage.getStore();
  }

  get requestId(): string | undefined {
    return this.getStore()?.requestId;
  }

  get tenantCode(): string | undefined {
    return this.getStore()?.tenantCode;
  }

  get sessionId(): string | undefined {
    return this.getStore()?.sessionId;
  }

  get userId(): string | undefined {
    return this.getStore()?.userId;
  }

  get language(): string | undefined {
    return this.getStore()?.language;
  }

  get timezone(): string | undefined {
    return this.getStore()?.timezone;
  }
}
