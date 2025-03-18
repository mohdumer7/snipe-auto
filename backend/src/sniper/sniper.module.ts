// src/sniper/sniper.module.ts
import { Module } from '@nestjs/common';
import { SniperService } from './sniper.service';
import { SniperController } from './sniper.controller';
import { TokenModule } from '../token/token.module'; // Import TokenModule
import { TradingModule } from '../trading/trading.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokenModule, TradingModule, UserModule],
  providers: [SniperService],
  controllers: [SniperController],
  exports: [SniperService],
})
export class SniperModule {}
