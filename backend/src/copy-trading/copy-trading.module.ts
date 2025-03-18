// src/copy-trading/copy-trading.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CopyTradingService } from './copy-trading.service';
import { CopyTradingController } from './copy-trading.controller';
import { FollowedWallet, FollowedWalletSchema } from './schemas/followed-wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FollowedWallet.name, schema: FollowedWalletSchema }]),
  ],
  controllers: [CopyTradingController],
  providers: [CopyTradingService],
  exports: [CopyTradingService],
})
export class CopyTradingModule {}
