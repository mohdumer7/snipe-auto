// src/observability/observability.module.ts
import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import * as client from 'prom-client';

@Module({
  controllers: [MetricsController],
})
export class ObservabilityModule {
  constructor() {
    // Collect default metrics (e.g., process, OS, etc.)
    client.collectDefaultMetrics();
  }
}
