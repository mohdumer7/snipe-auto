import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IChainService } from './chain.interface';
import { SolanaChainService } from './solana-chain.service';
import { EthereumChainService } from './ethereum-chain.service';

@Injectable()
export class MultiChainService {
  private readonly logger = new Logger(MultiChainService.name);
  private chainServices: { [key: string]: IChainService };

  constructor(
    private configService: ConfigService,
    private solanaChainService: SolanaChainService,
    private ethereumChainService: EthereumChainService,
  ) {
    // Map chain names to their implementations.
    this.chainServices = {
      solana: this.solanaChainService,
      ethereum: this.ethereumChainService,
      // Add additional chain services as needed.
    };
  }

  async getTokensByChain(chain: string): Promise<any[]> {
    // Dummy implementation: return tokens based on the provided chain.
    if (chain.toLowerCase() === 'ethereum') {
      return [
        {
          name: 'ETH_MEME1',
          mintAddress: 'EthereumTokenMint1',
          chain: 'ethereum',
          liquidity: 50,
          marketCap: 500000,
          ageSeconds: 300,
        },
      ];
    } else if (chain.toLowerCase() === 'bsc') {
      return [
        {
          name: 'BSC_MEME1',
          mintAddress: 'BSCTokenMint1',
          chain: 'bsc',
          liquidity: 30,
          marketCap: 150000,
          ageSeconds: 120,
        },
      ];
    } else {
      // Default to Solana.
      return [
        {
          name: 'SOL_MEME1',
          mintAddress: 'SolanaTokenMint1',
          chain: 'solana',
          liquidity: 5,
          marketCap: 9000,
          ageSeconds: 10,
        },
      ];
    }
  }

  async buyToken(chain: string, userWallet: string, tokenAddress: string, amount: number): Promise<any> {
    this.logger.log(`MultiChainService: Processing buy for chain ${chain}`);
    const service = this.chainServices[chain.toLowerCase()];
    if (!service) {
      throw new Error(`Chain service for ${chain} is not supported.`);
    }
    return service.buyToken(userWallet, tokenAddress, amount);
  }

  async sellToken(chain: string, userWallet: string, tokenAddress: string, amount: number): Promise<any> {
    this.logger.log(`MultiChainService: Processing sell for chain ${chain}`);
    const service = this.chainServices[chain.toLowerCase()];
    if (!service) {
      throw new Error(`Chain service for ${chain} is not supported.`);
    }
    return service.sellToken(userWallet, tokenAddress, amount);
  }
}
