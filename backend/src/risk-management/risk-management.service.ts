import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RiskManagementConfig, RiskManagementConfigDocument } from './schemas/risk-management.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RiskManagementService {
  private readonly logger = new Logger(RiskManagementService.name);
  constructor(
    @InjectModel(RiskManagementConfig.name) private riskConfigModel: Model<RiskManagementConfigDocument>,
    private configService: ConfigService,
  ) {}

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

  async getRiskConfig(userWalletAddress: string): Promise<RiskManagementConfig> {
    const config = await this.riskConfigModel.findOne({ userWalletAddress }).exec();
    if (!config) {
      throw new NotFoundException('Risk configuration not found for this user.');
    }
    return config;
  }

  async checkRisk(userWalletAddress: string): Promise<{ riskTriggered: boolean; portfolioValue: number; config: RiskManagementConfig }> {
    const portfolioValue = Math.random() * 5 + 5;
    const config = await this.getRiskConfig(userWalletAddress);
    const thresholdValue = 10 * (1 + config.portfolioStopLoss / 100);
    const riskTriggered = portfolioValue < thresholdValue;
    this.logger.log(`Risk check for wallet ${userWalletAddress}: portfolio ${portfolioValue} vs threshold ${thresholdValue}`);
    return { riskTriggered, portfolioValue, config };
  }
}
