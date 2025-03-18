// src/observability/metrics.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as client from 'prom-client';

@Controller('metrics')
export class MetricsController {
  @Get()
  async getMetrics(@Res() res: Response) {
    // Set the content type as text for Prometheus to scrape
    res.set('Content-Type', client.register.contentType);
    // Return the current metrics in Prometheus text format
    res.end(await client.register.metrics());
  }
}
