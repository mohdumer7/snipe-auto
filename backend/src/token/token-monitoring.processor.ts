import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { TokenCategorizationService } from './token-categorization.service';
import { RugDetectionService } from './rug-detection.service';
import { LifecycleService } from './lifecycle.service';
import { BluechipService } from './bluechip.service';
import { AiSniperService } from '../sniper/ai-sniper.service';

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
  ) {}

  @Process('process-token-event')
  async handleTokenEvent(job: Job<any>) {
    this.logger.log(`Processing token event job id: ${job.id}`);
    try {
      const rawEvent = job.data;
      // 1. Categorize the token
      const token = await this.tokenCategorizationService.categorizeTokenEvent(rawEvent);
      // 2. Run rug detection analysis
      await this.rugDetectionService.analyzeToken(token);
      // 3. Update lifecycle if launchProgress is provided
      if (rawEvent.launchProgress !== undefined) {
        await this.lifecycleService.updateTokenLifecycle(token.mintAddress, rawEvent.launchProgress);
      }
      // 4. Evaluate bluechip status
      await this.bluechipService.evaluateBluechip(token.mintAddress);
      // 5. Process token for AI sniper logic
      await this.aiSniperService.processTokenForSniping(token);
      this.logger.log(`Finished processing token event for ${token.name}`);
    } catch (error) {
      this.logger.error(`Error processing token event job id ${job.id}`, error.stack);
      throw error;
    }
  }
}
