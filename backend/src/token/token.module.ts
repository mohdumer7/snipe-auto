import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { BullModule } from '@nestjs/bull';
import { TokenMonitoringService } from './token-monitoring.service';
import { TokenMonitoringProcessor } from './token-monitoring.processor';

@Module({
  controllers: [TokenController],
  providers: [TokenService,TokenMonitoringService, TokenMonitoringProcessor],
  exports: [TokenService,TokenMonitoringService],  
  imports: [
    BullModule.registerQueue({
      name: 'token-monitoring',
    }),
  ],
})
export class TokenModule {}
