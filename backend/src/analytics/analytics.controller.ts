// src/analytics/analytics.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // Endpoint to fetch performance metrics for a user's trades.
  // Example: GET /analytics/performance/YourUserWalletAddress
  @Get('performance/:userWalletAddress')
  async getPerformanceMetrics(@Param('userWalletAddress') userWalletAddress: string) {
    return this.analyticsService.getPerformanceMetrics(userWalletAddress);
  }
}
