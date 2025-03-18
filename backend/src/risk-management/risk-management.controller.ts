import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RiskManagementService } from './risk-management.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetRiskConfigDto } from './dto/set-risk-config.dto';

@Controller('risk-management')
@UseGuards(JwtAuthGuard)
export class RiskManagementController {
  constructor(private riskService: RiskManagementService) {}

  @Post('set')
  async setRiskConfig(@Body() setRiskConfigDto: SetRiskConfigDto) {
    return this.riskService.setRiskConfig(setRiskConfigDto);
  }

  @Get(':userWalletAddress')
  async getRiskConfig(@Param('userWalletAddress') userWalletAddress: string) {
    return this.riskService.getRiskConfig(userWalletAddress);
  }

  @Get('check/:userWalletAddress')
  async checkRisk(@Param('userWalletAddress') userWalletAddress: string) {
    return this.riskService.checkRisk(userWalletAddress);
  }
}
