// src/token/token-monitoring.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@Processor('token-monitoring')
export class TokenMonitoringProcessor {
  private readonly logger = new Logger(TokenMonitoringProcessor.name);

  @Process('process-token-event')
  async handleTokenEvent(job: Job<any>) {
    this.logger.log(`Processing token event job id: ${job.id}`);
    try {
      // Extract job data (logs and context)
      const { logs, context } = job.data;
      this.logger.debug(`Job data: ${JSON.stringify({ logs, context })}`);
      
      // Parse logs to check for a token creation event.
      // This is a placeholder: in production, implement robust parsing.
      if (logs.logs && Array.isArray(logs.logs)) {
        for (const line of logs.logs) {
          if (line.includes('NewTokenCreated')) {
            // Extract token details from the log line (example placeholder values)
            const tokenData = { 
              name: 'ExtractedTokenName', 
              mintAddress: 'ExtractedMintAddress', 
              liquidity: 1, 
              marketCap: 1000, 
              createdAt: new Date() 
            };
            this.logger.log(`New token detected: ${JSON.stringify(tokenData)}`);
            // TODO: Save tokenData into your database via a TokenService method
            // e.g., await this.tokenService.saveToken(tokenData);
          }
        }
      }
      
      this.logger.log(`Finished processing job id: ${job.id}`);
    } catch (error) {
      this.logger.error(`Error processing token event job id: ${job.id}`, error.stack);
      throw error;
    }
  }
}
