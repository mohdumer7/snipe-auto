import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CopyTrade, CopyTradeDocument } from './schemas/copy-trade.schema';

@Injectable()
export class CopyTradingService {
  private readonly logger = new Logger(CopyTradingService.name);

  constructor(
    @InjectModel(CopyTrade.name) private copyTradeModel: Model<CopyTradeDocument>,
  ) {}

  async followWallet(data: {
    userWalletAddress: string;
    leaderWalletAddress: string;
    allocation: number;
    maxPerTrade?: number;
  }): Promise<CopyTrade> {
    const follow = new this.copyTradeModel(data);
    this.logger.log(`Wallet ${data.userWalletAddress} is now following ${data.leaderWalletAddress}`);
    return follow.save();
  }

  async getFollowedWallets(userWalletAddress: string): Promise<CopyTrade[]> {
    return this.copyTradeModel.find({ userWalletAddress }).exec();
  }

  // Dummy analytics: in production, aggregate trade data for performance.
  async analyzeWallet(walletAddress: string): Promise<any> {
    return {
      walletAddress,
      balance: 10, // SOL balance (dummy)
      profitLoss: 2.5, // Dummy profit
      winRate: 70, // Dummy win rate percentage
      numberOfTrades: 15,
    };
  }
}
