// src/trading/trading.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from './schemas/trade.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class TradingService {
  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async buyToken(
    userWalletAddress: string,
    tokenMintAddress: string,
    amount: number,
    slippage: number,
    priorityFee: number,
  ): Promise<Trade> {
    // Simulated trade execution logic.
    const trade = new this.tradeModel({
      userWalletAddress,
      tokenMintAddress,
      type: 'buy',
      amount,
      status: 'completed',
    });
    const savedTrade = await trade.save();

    // Emit a trade update notification to connected clients
    this.notificationsGateway.notifyTradeUpdate({
      type: 'buy',
      trade: savedTrade,
    });

    return savedTrade;
  }

  async sellToken(
    userWalletAddress: string,
    tokenMintAddress: string,
    amount: number,
    slippage: number,
    priorityFee: number,
  ): Promise<Trade> {
    // Simulated sell logic.
    const trade = new this.tradeModel({
      userWalletAddress,
      tokenMintAddress,
      type: 'sell',
      amount,
      status: 'completed',
    });
    const savedTrade = await trade.save();

    // Emit a trade update notification
    this.notificationsGateway.notifyTradeUpdate({
      type: 'sell',
      trade: savedTrade,
    });

    return savedTrade;
  }

  async getHoldings(userWalletAddress: string): Promise<{ tokenMintAddress: string; netAmount: number }[]> {
    const trades = await this.tradeModel.find({ userWalletAddress }).exec();
    const holdingsMap: Record<string, number> = {};
    trades.forEach(trade => {
      if (!holdingsMap[trade.tokenMintAddress]) {
        holdingsMap[trade.tokenMintAddress] = 0;
      }
      if (trade.type === 'buy') {
        holdingsMap[trade.tokenMintAddress] += trade.amount;
      } else if (trade.type === 'sell') {
        holdingsMap[trade.tokenMintAddress] -= trade.amount;
      }
    });
    return Object.keys(holdingsMap).map(tokenMintAddress => ({
      tokenMintAddress,
      netAmount: holdingsMap[tokenMintAddress],
    }));
  }
}
