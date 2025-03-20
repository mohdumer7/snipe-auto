import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CopyTradingService } from './copy-trading.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('copy-trading')
@UseGuards(JwtAuthGuard)
export class CopyTradingController {
  constructor(private copyTradingService: CopyTradingService) {}

  @Post('follow')
  async followWallet(@Body() data: { 
    userWalletAddress: string;
    leaderWalletAddress: string;
    allocation: number;
    maxPerTrade?: number;
  }) {
    return this.copyTradingService.followWallet(data);
  }

  @Get(':userWalletAddress')
  async getFollowedWallets(@Param('userWalletAddress') userWalletAddress: string) {
    return this.copyTradingService.getFollowedWallets(userWalletAddress);
  }

  @Get('analyze/:walletAddress')
  async analyzeWallet(@Param('walletAddress') walletAddress: string) {
    return this.copyTradingService.analyzeWallet(walletAddress);
  }
}
