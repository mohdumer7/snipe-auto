import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { CopyTradingService } from './copy-trading.service';
import { CopyTradingController } from './copy-trading.controller';
import { CopyTrade, CopyTradeSchema } from './schemas/copy-trade.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CopyTrade.name, schema: CopyTradeSchema }]),
    BullModule.registerQueue({ name: 'copy-trading' }),
  ],
  controllers: [CopyTradingController],
  providers: [CopyTradingService],
  exports: [CopyTradingService],
})
export class CopyTradingModule {}
