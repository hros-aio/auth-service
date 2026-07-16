import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { AppModule } from '../src/app.module';

describe('MetricsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/metrics (GET) - 200 OK with plain text metrics', () => {
    return request(app.getHttpServer())
      .get('/metrics')
      .expect(200)
      .expect('Content-Type', /text\/plain/)
      .expect((res: Response) => {
        expect(res.text).toContain('node_memory_rss_bytes');
        expect(res.text).toContain('node_memory_heap_total_bytes');
        expect(res.text).toContain('node_memory_heap_used_bytes');
        expect(res.text).toContain('node_process_uptime_seconds');
        expect(res.text).toContain('node_cpu_user_time_microseconds');
        expect(res.text).toContain('node_cpu_system_time_microseconds');
      });
  });
});
