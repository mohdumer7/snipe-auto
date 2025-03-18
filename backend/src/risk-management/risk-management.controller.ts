// src/risk-management/risk-management.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RiskManagementService } from './risk-management.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('risk-management')
@UseGuards(JwtAuthGuard) // Protect endpoints with JWT authentication
export class RiskManagementController {
  constructor(private riskService: RiskManagementService) {}

  // Endpoint to set or update risk configuration.
  @Post('set')
  async setRiskConfig(@Body() config: { userWalletAddress: string; portfolioStopLoss: number; trailingStop?: number; }) {
    return this.riskService.setRiskConfig(config);
  }

  // Endpoint to retrieve the risk configuration for a user.
  @Get(':userWalletAddress')
  async getRiskConfig(@Param('userWalletAddress') userWalletAddress: string) {
    return this.riskService.getRiskConfig(userWalletAddress);
  }

  // Endpoint to check if risk thresholds are triggered.
  @Get('check/:userWalletAddress')
  async checkRisk(@Param('userWalletAddress') userWalletAddress: string) {
    return this.riskService.checkRisk(userWalletAddress);
  }
}
