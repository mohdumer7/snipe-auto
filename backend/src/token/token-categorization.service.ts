import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenCategorizationService {
  private readonly logger = new Logger(TokenCategorizationService.name);

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async categorizeTokenEvent(rawEvent: any): Promise<Token> {
    let source = 'unknown';
    if (rawEvent.log && rawEvent.log.includes('Pump.fun')) {
      source = 'pumpfun';
    } else if (rawEvent.log && rawEvent.log.includes('Raydium')) {
      source = 'raydium';
    } else if (rawEvent.log && rawEvent.log.includes('Moonshot')) {
      source = 'moonshot';
    }

    const tokenData = {
      mintAddress: rawEvent.mintAddress || 'UnknownMintAddress',
      name: rawEvent.tokenName || 'Unnamed Token',
      source,
      creationTime: rawEvent.timestamp ? new Date(rawEvent.timestamp) : new Date(),
      developerWallet: rawEvent.developerWallet || 'Unknown',
      liquidity: rawEvent.liquidity || 0,
      marketCap: rawEvent.marketCap || 0,
      launchProgress: rawEvent.launchProgress || 0,
      rugRisk: false,
      scamPotential: false,
      bluechip: false,
    };

    this.logger.log(`Categorizing token: ${JSON.stringify(tokenData)}`);
    const token = await this.tokenModel.findOneAndUpdate(
      { mintAddress: tokenData.mintAddress },
      tokenData,
      { new: true, upsert: true },
    ).exec();
    return token;
  }
}
