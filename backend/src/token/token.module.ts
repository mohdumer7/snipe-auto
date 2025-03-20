import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenSchema } from './schemas/token.schema';
import { TokenCategorizationService } from './token-categorization.service';
import { RugDetectionService } from './rug-detection.service';
import { LifecycleService } from './lifecycle.service';
import { BluechipService } from './bluechip.service';
import { AdvancedTokenDexService } from './advanced-token-dex.service';
import { forwardRef as fwd } from '@nestjs/common';
import { SniperModule } from '../sniper/sniper.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
    BullModule.registerQueue({
      name: 'token-monitoring',
    }),
    forwardRef(() => SniperModule),
  ],
  controllers: [TokenController],
  providers: [
    TokenService,
    TokenCategorizationService,
    RugDetectionService,
    LifecycleService,
    BluechipService,
    AdvancedTokenDexService,
  ],
  exports: [
    TokenService,
    TokenCategorizationService,
    RugDetectionService,
    LifecycleService,
    BluechipService,
    AdvancedTokenDexService,
  ],
})
export class TokenModule {}
