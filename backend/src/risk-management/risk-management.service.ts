// src/risk-management/risk-management.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RiskManagementConfig, RiskManagementConfigDocument } from './schemas/risk-management.schema';

@Injectable()
export class RiskManagementService {
  constructor(
    @InjectModel(RiskManagementConfig.name) private riskConfigModel: Model<RiskManagementConfigDocument>,
  ) {}

  // Set or update the risk management configuration for a user.
  async setRiskConfig(config: { userWalletAddress: string; portfolioStopLoss: number; trailingStop?: number; }): Promise<RiskManagementConfig> {
    const existing = await this.riskConfigModel.findOne({ userWalletAddress: config.userWalletAddress }).exec();
    if (existing) {
      existing.portfolioStopLoss = config.portfolioStopLoss;
      existing.trailingStop = config.trailingStop;
      return existing.save();
    }
    const newConfig = new this.riskConfigModel(config);
    return newConfig.save();
  }

  // Retrieve the risk management configuration for a user.
  async getRiskConfig(userWalletAddress: string): Promise<RiskManagementConfig> {
    const config = await this.riskConfigModel.findOne({ userWalletAddress }).exec();
    if (!config) {
      throw new NotFoundException('Risk configuration not found for this user.');
    }
    return config;
  }

  // Simulated check: In production, fetch real portfolio value using TradingService and price data.
  // Here we simulate a portfolio value and compare it against the configured stop-loss.
  async checkRisk(userWalletAddress: string): Promise<{ riskTriggered: boolean; portfolioValue: number; config: RiskManagementConfig }> {
    // For simulation, assume portfolio value is a random number between 5 and 10 SOL.
    const portfolioValue = Math.random() * 5 + 5; // value between 5 and 10
    const config = await this.getRiskConfig(userWalletAddress);
    
    // For example, if the config.portfolioStopLoss is -30, assume the initial portfolio was 10 SOL.
    // Trigger risk if current value is below 70% of the initial value (i.e. below 7 SOL).
    const thresholdValue = 10 * (1 + config.portfolioStopLoss / 100); // e.g., 10 * 0.7 = 7
    const riskTriggered = portfolioValue < thresholdValue;

    return { riskTriggered, portfolioValue, config };
  }
}
