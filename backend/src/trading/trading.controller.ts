// src/trading/trading.controller.ts
import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { TradingService } from './trading.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trade')
@UseGuards(JwtAuthGuard) // Protect all endpoints in this controller
export class TradingController {
  constructor(private tradingService: TradingService) {}

  @Post('buy')
  async buyToken(
    @Body('walletAddress') walletAddress: string,
    @Body('tokenMintAddress') tokenMintAddress: string,
    @Body('amount') amount: number,
    @Body('slippage') slippage: number,
    @Body('priorityFee') priorityFee: number,
  ) {
    return this.tradingService.buyToken(walletAddress, tokenMintAddress, amount, slippage, priorityFee);
  }

  @Post('sell')
  async sellToken(
    @Body('walletAddress') walletAddress: string,
    @Body('tokenMintAddress') tokenMintAddress: string,
    @Body('amount') amount: number,
    @Body('slippage') slippage: number,
    @Body('priorityFee') priorityFee: number,
  ) {
    return this.tradingService.sellToken(walletAddress, tokenMintAddress, amount, slippage, priorityFee);
  }

  @Get('holdings')
  async getHoldings(@Query('walletAddress') walletAddress: string) {
    return this.tradingService.getHoldings(walletAddress);
  }
}
