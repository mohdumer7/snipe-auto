import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { TokenCategorizationService } from './token-categorization.service';
import { RugDetectionService } from './rug-detection.service';
import { LifecycleService } from './lifecycle.service';
import { BluechipService } from './bluechip.service';
import { AiSniperService } from '../sniper/ai-sniper.service';
import { AdvancedTokenDexService } from './advanced-token-dex.service';

@Injectable()
@Processor('token-monitoring')
export class TokenMonitoringProcessor {
  private readonly logger = new Logger(TokenMonitoringProcessor.name);

  constructor(
    private tokenCategorizationService: TokenCategorizationService,
    private rugDetectionService: RugDetectionService,
    private lifecycleService: LifecycleService,
    private bluechipService: BluechipService,
    private aiSniperService: AiSniperService,
    private advancedTokenDexService: AdvancedTokenDexService,
  ) {}

  @Process('process-token-event')
  async handleTokenEvent(job: Job<any>) {
    this.logger.log(`Processing token event job id: ${job.id}`);
    try {
      const rawEvent = job.data;
      const token = await this.tokenCategorizationService.categorizeTokenEvent(rawEvent);
      await this.rugDetectionService.analyzeToken(token);
      if (rawEvent.launchProgress !== undefined) {
        await this.lifecycleService.updateTokenLifecycle(token.mintAddress, rawEvent.launchProgress);
      }
      await this.bluechipService.evaluateBluechip(token.mintAddress);
      await this.aiSniperService.processTokenForSniping(token);
      await this.advancedTokenDexService.processTokenEvent(rawEvent);
      this.logger.log(`Finished processing token event for ${token.name}`);
    } catch (error) {
      this.logger.error(`Error processing token event job id ${job.id}`, error.stack);
      throw error;
    }
  }
}
