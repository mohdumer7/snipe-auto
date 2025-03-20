import { Module, forwardRef } from '@nestjs/common';
import { SniperController } from './sniper.controller';
import { AiSniperService } from './ai-sniper.service';
import { forwardRef as fwd } from '@nestjs/common';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    forwardRef(() => TokenModule),
  ],
  controllers: [SniperController],
  providers: [AiSniperService],
  exports: [AiSniperService],
})
export class SniperModule {}
