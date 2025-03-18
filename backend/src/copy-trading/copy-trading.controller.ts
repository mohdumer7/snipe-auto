import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CopyTradingService } from './copy-trading.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowWalletDto } from './dto/follow-wallet.dto';

@Controller('copy-trading')
@UseGuards(JwtAuthGuard)
export class CopyTradingController {
  constructor(private copyTradingService: CopyTradingService) {}

  @Post('follow')
  async followWallet(@Body() followWalletDto: FollowWalletDto) {
    return this.copyTradingService.followWallet(followWalletDto);
  }

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
