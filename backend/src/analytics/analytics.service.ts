// src/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from '../trading/schemas/trade.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
  ) {}

  async getPerformanceMetrics(userWalletAddress: string): Promise<any> {
    // Retrieve all trade records for the user
    const trades = await this.tradeModel.find({ userWalletAddress }).exec();
    const totalTrades = trades.length;
    const buyTrades = trades.filter(t => t.type === 'buy');
    const sellTrades = trades.filter(t => t.type === 'sell');
    const totalBuy = buyTrades.reduce((acc, trade) => acc + trade.amount, 0);
    const totalSell = sellTrades.reduce((acc, trade) => acc + trade.amount, 0);
    
    // For simulation, assume net profit is totalSell minus totalBuy.
    const netProfit = totalSell - totalBuy;
    const averageTradeAmount = totalTrades > 0 ? (totalBuy + totalSell) / (2 * totalTrades) : 0;
    
    // Simulate win rate as a placeholder (e.g. 60% if net profit is non-negative, else 40%)
    const winRate = netProfit >= 0 ? 60 : 40;
    
    return {
      totalTrades,
      buyCount: buyTrades.length,
      sellCount: sellTrades.length,
      totalBuy,
      totalSell,
      netProfit,
      averageTradeAmount,
      winRate,
    };
  }
}
