import { Injectable, Logger } from '@nestjs/common';
import { CreateAiSniperDto } from './dto/create-ai-sniper.dto';

@Injectable()
export class AiSniperService {
  private readonly logger = new Logger(AiSniperService.name);
  private sniperConfigs: CreateAiSniperDto[] = [];

  createSniperConfig(config: CreateAiSniperDto): CreateAiSniperDto {
    this.sniperConfigs.push(config);
    this.logger.log(`Created AI sniper config for wallet ${config.userWalletAddress}`);
    return config;
  }

  getSniperConfigs(): CreateAiSniperDto[] {
    this.logger.log(`Retrieving AI sniper configs. Count: ${this.sniperConfigs.length}`);
    return this.sniperConfigs;
  }

  async processTokenForSniping(token: any): Promise<void> {
    for (const config of this.sniperConfigs) {
      if (config.excludeScam && token.scamPotential) {
        this.logger.log(`Skipping token ${token.name} for wallet ${config.userWalletAddress} due to scam flag.`);
        continue;
      }
      if (token.liquidity >= config.minLiquidity && token.marketCap <= config.maxMarketCap) {
        this.logger.log(`Token ${token.name} meets sniper criteria for wallet ${config.userWalletAddress}`);
        // In production, trigger a buy order via TradingService.
      }
    }
  }
}
