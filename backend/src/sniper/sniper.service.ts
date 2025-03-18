import { Injectable, Logger } from '@nestjs/common';
import { Token, TokenService } from '../token/token.service';
import { TradingService } from '../trading/trading.service';
import { UserService } from '../user/user.service';
import { CreateSniperDto } from './dto/create-sniper.dto';

@Injectable()
export class SniperService {
  private readonly logger = new Logger(SniperService.name);
  private sniperConfigs: CreateSniperDto[] = [];

  constructor(
    private tokenService: TokenService,
    private tradingService: TradingService,
    private userService: UserService,
  ) {}

  createSniperConfig(config: CreateSniperDto): CreateSniperDto {
    this.sniperConfigs.push(config);
    this.logger.log(`Created sniper config for wallet ${config.userWalletAddress}`);
    return config;
  }

  getSniperConfigs(): CreateSniperDto[] {
    this.logger.log(`Retrieving all sniper configs. Total: ${this.sniperConfigs.length}`);
    return this.sniperConfigs;
  }

  async runSniperBots(): Promise<void> {
    this.logger.log('Running sniper bots');
    const tokens: Token[] = this.tokenService.getTokens('new');
    for (const config of this.sniperConfigs.filter(c => c.active)) {
      for (const token of tokens) {
        if (
          token.liquidity >= config.minLiquidity &&
          token.marketCap <= config.maxMarketCap &&
          !token.flaggedScam
        ) {
          this.logger.log(`Sniper condition met for wallet ${config.userWalletAddress} on token ${token.name}`);
          try {
            await this.tradingService.buyToken(
              config.userWalletAddress,
              token.mintAddress,
              config.investmentAmount,
              1,     // simulated slippage
              0.001, // simulated priority fee
            );
            this.logger.log(`Executed sniper trade for wallet ${config.userWalletAddress} on token ${token.name}`);
          } catch (error) {
            this.logger.error(
              `Failed sniper trade for wallet ${config.userWalletAddress} on token ${token.name}`,
              error.stack,
            );
          }
        }
      }
    }
  }
}
