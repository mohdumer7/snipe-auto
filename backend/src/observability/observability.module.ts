import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import * as client from 'prom-client';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class ObservabilityModule {
  constructor(private readonly metricsService: MetricsService) {
    client.collectDefaultMetrics();
  }
}
