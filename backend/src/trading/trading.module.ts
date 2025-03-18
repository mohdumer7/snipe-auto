// src/trading/trading.module.ts
import { Module } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingController } from './trading.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './schemas/trade.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]),
    NotificationsModule, // Import the module providing NotificationsGateway
  ],
  controllers: [TradingController],
  providers: [TradingService],
  exports: [TradingService],
})
export class TradingModule {}
