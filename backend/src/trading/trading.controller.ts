import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { TradingService } from './trading.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TradeDto } from './dto/trade.dto';

@Controller('trade')
@UseGuards(JwtAuthGuard)
export class TradingController {
  constructor(private tradingService: TradingService) {}

  @Post('buy')
  async buyToken(@Body() tradeDto: TradeDto) {
    return this.tradingService.buyToken(
      tradeDto.walletAddress,
      tradeDto.tokenMintAddress,
      tradeDto.amount,
      tradeDto.slippage,
      tradeDto.priorityFee,
    );
  }

  @Post('sell')
  async sellToken(@Body() tradeDto: TradeDto) {
    return this.tradingService.sellToken(
      tradeDto.walletAddress,
      tradeDto.tokenMintAddress,
      tradeDto.amount,
      tradeDto.slippage,
      tradeDto.priorityFee,
    );
  }

  @Get('holdings')
  async getHoldings(@Query('walletAddress') walletAddress: string) {
    return this.tradingService.getHoldings(walletAddress);
  }
}
