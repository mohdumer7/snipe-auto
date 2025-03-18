// src/sniper/sniper.service.ts
import { Injectable } from '@nestjs/common';
import { Token, TokenService } from '../token/token.service';
import { TradingService } from '../trading/trading.service';
import { UserService } from '../user/user.service';

export interface SniperConfig {
  userWalletAddress: string;
  minLiquidity: number;
  maxMarketCap: number;
  investmentAmount: number;
  active: boolean;
}

@Injectable()
export class SniperService {
  // In-memory storage for sniper configurations
  private sniperConfigs: SniperConfig[] = [];

  constructor(
    private tokenService: TokenService,
    private tradingService: TradingService,
    private userService: UserService,
  ) {}

  createSniperConfig(config: SniperConfig): SniperConfig {
    this.sniperConfigs.push(config);
    return config;
  }

  getSniperConfigs(): SniperConfig[] {
    return this.sniperConfigs;
  }

  // This method simulates running sniper bots by scanning for new tokens
  // that meet the user's criteria and executing a buy.
  async runSniperBots(): Promise<void> {
    // For simulation, retrieve tokens in the "new" category.
    const tokens: Token[] = this.tokenService.getTokens('new');

    // Loop through each active sniper configuration.
    for (const config of this.sniperConfigs.filter(c => c.active)) {
      for (const token of tokens) {
        // Check if token meets criteria.
        if (
          token.liquidity >= config.minLiquidity &&
          token.marketCap <= config.maxMarketCap &&
          !token.flaggedScam
        ) {
          // Execute a simulated buy order.
          await this.tradingService.buyToken(
            config.userWalletAddress,
            token.mintAddress,
            config.investmentAmount,
            1,     // simulated slippage percentage
            0.001, // simulated priority fee
          );
          console.log(
            `Executed sniper trade for user ${config.userWalletAddress} on token ${token.name}`
          );
        }
      }
    }
  }
}
