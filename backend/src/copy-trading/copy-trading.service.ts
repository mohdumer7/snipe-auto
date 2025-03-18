// src/copy-trading/copy-trading.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FollowedWallet, FollowedWalletDocument } from './schemas/followed-wallet.schema';

@Injectable()
export class CopyTradingService {
  constructor(
    @InjectModel(FollowedWallet.name) private followedWalletModel: Model<FollowedWalletDocument>,
  ) {}

  // Follow a leader wallet by creating a record for copy trading.
  async followWallet(data: {
    userWalletAddress: string;
    leaderWalletAddress: string;
    allocation: number;
    maxPerTrade?: number;
  }): Promise<FollowedWallet> {
    const followedWallet = new this.followedWalletModel({ 
      userWalletAddress: data.userWalletAddress,
      leaderWalletAddress: data.leaderWalletAddress,
      allocation: data.allocation,
      maxPerTrade: data.maxPerTrade || 1,
      active: true,
    });
    return followedWallet.save();
  }

  // Retrieve all followed wallets for a given user.
  async getFollowedWallets(userWalletAddress: string): Promise<FollowedWallet[]> {
    return this.followedWalletModel.find({ userWalletAddress }).exec();
  }

  // Simulate copying a trade: when a leader wallet trades, replicate the trade for each follower.
  async simulateCopyTrade(
    leaderWalletAddress: string,
    tokenMintAddress: string,
    tradeAmount: number,
  ): Promise<any[]> {
    // In production, this method would trigger on real-time events.
    const followers = await this.followedWalletModel.find({ leaderWalletAddress, active: true }).exec();
    const copyTrades = followers.map(follower => ({
      userWalletAddress: follower.userWalletAddress,
      tokenMintAddress,
      tradeAmount: Math.min(tradeAmount, follower.allocation), // scale down if needed
      status: 'copied',
    }));
    return copyTrades;
  }

  // Simulate wallet analytics. In production, you'd aggregate on-chain trade data.
  async analyzeWallet(walletAddress: string): Promise<any> {
    return {
      walletAddress,
      balance: 10, // in SOL (simulated)
      profitLoss: 2.5, // simulated SOL profit
      winRate: 75, // simulated percentage
      numberOfTrades: 10,
    };
  }
}
