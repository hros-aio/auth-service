import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Controller('test-correlation')
class TestCorrelationController {
  @Get()
  getTest(): { ok: boolean } {
    return { ok: true };
  }
}

describe('Correlation Headers & Request ID Propagation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestCorrelationController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return client request-id in response header and body envelope', () => {
    const testReqId = 'correlation-trace-id-abc';

    return request(app.getHttpServer())
      .get('/test-correlation')
      .set('x-request-id', testReqId)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-request-id']).toBe(testReqId);
        expect(res.body.success).toBe(true);
        expect(res.body.requestId).toBe(testReqId);
        expect(res.body.data).toEqual({ ok: true });
      });
  });

  it('should automatically generate a UUID request-id if header is missing', () => {
    return request(app.getHttpServer())
      .get('/test-correlation')
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-request-id']).toBeDefined();
        expect(res.headers['x-request-id'].length).toBeGreaterThan(10);
        expect(res.body.requestId).toBe(res.headers['x-request-id']);
      });
  });
});
