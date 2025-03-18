// src/copy-trading/copy-trading.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CopyTradingService } from './copy-trading.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('copy-trading')
export class CopyTradingController {
  constructor(private copyTradingService: CopyTradingService) {}

  // Endpoint to follow a leader wallet.
  @Post('follow')
  async followWallet(
    @Body() data: {
      userWalletAddress: string;
      leaderWalletAddress: string;
      allocation: number;
      maxPerTrade?: number;
    },
  ) {
    return this.copyTradingService.followWallet(data);
  }

  // List followed wallets for a given user.
  @Get(':userWalletAddress')
  async getFollowedWallets(@Param('userWalletAddress') userWalletAddress: string) {
    return this.copyTradingService.getFollowedWallets(userWalletAddress);
  }

  // Endpoint to simulate a copy trade.
  @Post('simulate-copy-trade')
  @UseGuards(JwtAuthGuard)
  async simulateCopyTrade(
    @Body() data: {
      leaderWalletAddress: string;
      tokenMintAddress: string;
      tradeAmount: number;
    },
  ) {
    return this.copyTradingService.simulateCopyTrade(
      data.leaderWalletAddress,
      data.tokenMintAddress,
      data.tradeAmount,
    );
  }

  // Endpoint to analyze a wallet's performance.
  @Get('analyze/:walletAddress')
  async analyzeWallet(@Param('walletAddress') walletAddress: string) {
    return this.copyTradingService.analyzeWallet(walletAddress);
  }
}
