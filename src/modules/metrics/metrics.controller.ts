import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @ApiOperation({ summary: 'Get Prometheus formatted system metrics' })
  @ApiResponse({ status: 200, description: 'Prometheus metrics payload' })
  getMetrics(@Res() res: Response): void {
    const memory = process.memoryUsage();
    const uptime = process.uptime();
    const cpu = process.cpuUsage();

    const output = [
      '# HELP node_memory_rss_bytes Resident set size of the process in bytes.',
      '# TYPE node_memory_rss_bytes gauge',
      `node_memory_rss_bytes ${memory.rss}`,
      '',
      '# HELP node_memory_heap_total_bytes Total size of the allocated heap in bytes.',
      '# TYPE node_memory_heap_total_bytes gauge',
      `node_memory_heap_total_bytes ${memory.heapTotal}`,
      '',
      '# HELP node_memory_heap_used_bytes Actual heap used by the process in bytes.',
      '# TYPE node_memory_heap_used_bytes gauge',
      `node_memory_heap_used_bytes ${memory.heapUsed}`,
      '',
      '# HELP node_process_uptime_seconds Uptime of the process in seconds.',
      '# TYPE node_process_uptime_seconds gauge',
      `node_process_uptime_seconds ${uptime}`,
      '',
      '# HELP node_cpu_user_time_microseconds CPU user time spent in microseconds.',
      '# TYPE node_cpu_user_time_microseconds counter',
      `node_cpu_user_time_microseconds ${cpu.user}`,
      '',
      '# HELP node_cpu_system_time_microseconds CPU system time spent in microseconds.',
      '# TYPE node_cpu_system_time_microseconds counter',
      `node_cpu_system_time_microseconds ${cpu.system}`,
    ].join('\n');

    res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.status(200).send(output);
  }
}
