import { Injectable, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeveloperActivityService {
  private readonly logger = new Logger(DeveloperActivityService.name);
  private connection: Connection;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_PROVIDER_URL') || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  monitorDeveloperActivity(developerWalletAddress: string): void {
    const publicKey = new PublicKey(developerWalletAddress);
    this.connection.onLogs(publicKey, (logs, ctx) => {
      this.logger.log(`Developer activity from ${developerWalletAddress}: ${JSON.stringify(logs)}`);
      // In production, analyze logs for suspicious activity.
    });
  }
}
