import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class RugDetectionService {
  private readonly logger = new Logger(RugDetectionService.name);

  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async analyzeToken(token: Token): Promise<Token> {
    let rugRisk = false;
    let scamPotential = false;
    // Heuristic: liquidity < 1% of market cap is risky
    if (token.marketCap > 0 && token.liquidity < token.marketCap * 0.01) {
      rugRisk = true;
    }
    // If developer wallet is unknown, flag as scam potential
    if (!token.developerWallet || token.developerWallet === 'Unknown') {
      scamPotential = true;
    }
    token.rugRisk = rugRisk;
    token.scamPotential = scamPotential;
    this.logger.log(`Token ${token.name} analyzed: rugRisk=${rugRisk}, scamPotential=${scamPotential}`);
    //@ts-ignore
    return token.save();
  }
}
