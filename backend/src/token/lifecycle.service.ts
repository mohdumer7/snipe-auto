import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';

@Injectable()
export class LifecycleService {
  private readonly logger = new Logger(LifecycleService.name);

  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async updateTokenLifecycle(mintAddress: string, launchProgress: number): Promise<Token> {
    const token = await this.tokenModel.findOne({ mintAddress }).exec();
    if (!token) {
      throw new Error(`Token with mint ${mintAddress} not found`);
    }
    token.launchProgress = launchProgress;
    if (launchProgress >= 100) {
      token.source = 'graduated';
    } else if (launchProgress >= 80) {
      token.source = 'graduating';
    }
    this.logger.log(`Token ${token.name} updated: launchProgress=${launchProgress}, source=${token.source}`);
    return token.save();
  }
}
