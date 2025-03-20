import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenSchema } from './schemas/token.schema';
import { TokenMonitoringService } from './token-monitoring.service';
import { TokenMonitoringProcessor } from './token-monitoring.processor';
import { TokenCategorizationService } from './token-categorization.service';
import { RugDetectionService } from './rug-detection.service';
import { LifecycleService } from './lifecycle.service';
import { BluechipService } from './bluechip.service';
import { forwardRef as fwd } from '@nestjs/common';
import { SniperModule } from '../sniper/sniper.module'; // We'll use forwardRef here

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
    BullModule.registerQueue({
      name: 'token-monitoring',
    }),
    forwardRef(() => SniperModule), // Break circular dependency
  ],
  controllers: [TokenController],
  providers: [
    TokenService,
    TokenMonitoringService,
    TokenMonitoringProcessor,
    TokenCategorizationService,
    RugDetectionService,
    LifecycleService,
    BluechipService,
  ],
  exports: [
    TokenService,
    TokenMonitoringService,
    TokenCategorizationService,
    RugDetectionService,
    LifecycleService,
    BluechipService,
  ],
})
export class TokenModule {}
