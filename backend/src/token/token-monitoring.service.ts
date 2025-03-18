import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, PublicKey } from '@solana/web3.js';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TokenMonitoringService implements OnModuleInit {
  private readonly logger = new Logger(TokenMonitoringService.name);
  private connection: Connection;
  private programId: PublicKey;

  constructor(
    private configService: ConfigService,
    @InjectQueue('token-monitoring') private tokenMonitoringQueue: Queue,
  ) {
    // Use the RPC URL from the environment (devnet/testnet or mainnet)
    const rpcUrl = this.configService.get<string>('RPC_PROVIDER_URL');
    this.logger.log(`TokenMonitoringService connecting to: ${rpcUrl}`);
    //@ts-ignore
    this.connection = new Connection(rpcUrl, 'confirmed');

    // Retrieve the program ID from environment
    const programIdStr = this.configService.get<string>('TOKEN_MONITOR_PROGRAM_ID');
    if (!programIdStr) {
      throw new Error('TOKEN_MONITOR_PROGRAM_ID not set in environment.');
    }
    this.programId = new PublicKey(programIdStr);
  }

  async onModuleInit(): Promise<void> {
    this.startMonitoring();
  }

  async startMonitoring(): Promise<void> {
    this.logger.log(`Starting token monitoring for program: ${this.programId.toBase58()}`);
    this.connection.onLogs(this.programId, async (logs, ctx) => {
      try {
        this.logger.debug(`Received logs: ${JSON.stringify(logs)}`);

        // Check if logs indicate a new token creation event.
        if (this.isNewTokenEvent(logs)) {
          this.logger.log(`New token event detected from logs.`);
          // Enqueue the token event for further processing.
          await this.tokenMonitoringQueue.add('process-token-event', {
            logs,
            context: ctx,
          });
          this.logger.log(`Enqueued new token event for further processing.`);
        }
      } catch (error) {
        this.logger.error(`Error processing logs: ${error.message}`, error.stack);
      }
    });
  }

  /**
   * Determines whether the provided logs contain a new token event.
   * In production, this should be replaced with robust parsing logic.
   */
  private isNewTokenEvent(logs: any): boolean {
    if (logs.logs && Array.isArray(logs.logs)) {
      return logs.logs.some((line: string) => line.includes('NewTokenCreated'));
    }
    return false;
  }
}
