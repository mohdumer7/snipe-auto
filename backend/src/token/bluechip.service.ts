import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';

@Injectable()
export class BluechipService {
  private readonly logger = new Logger(BluechipService.name);

  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async evaluateBluechip(mintAddress: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ mintAddress }).exec();
    if (!token) {
      throw new Error(`Token with mint ${mintAddress} not found`);
    }
    const marketCapThreshold = 1000000;
    const liquidityThreshold = 100;
    const ageThresholdDays = 7;
    const ageDays = (Date.now() - (token.creationTime ? token.creationTime.getTime() : Date.now())) / (1000 * 60 * 60 * 24);
    const isBluechip = token.marketCap >= marketCapThreshold && token.liquidity >= liquidityThreshold && ageDays >= ageThresholdDays;
    token.bluechip = isBluechip;
    this.logger.log(`Token ${token.name} evaluated as bluechip: ${isBluechip}`);
    return token.save();
  }
}
