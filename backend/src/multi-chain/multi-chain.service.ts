// src/multi-chain/multi-chain.service.ts
import { Injectable } from '@nestjs/common';

export interface MultiChainToken {
  name: string;
  mintAddress: string;
  chain: string;
  liquidity: number;
  marketCap: number;
  flaggedScam?: boolean;
  ageSeconds: number;
}

@Injectable()
export class MultiChainService {
  // Simulated tokens for different chains.
  private tokens: MultiChainToken[] = [
    // Simulated Solana token (we already have these elsewhere, but for demonstration)
    {
      name: 'SOL_MEME1',
      mintAddress: 'SolanaTokenMint1',
      chain: 'solana',
      liquidity: 5,
      marketCap: 9000,
      ageSeconds: 10,
    },
    // Simulated Ethereum token
    {
      name: 'ETH_MEME1',
      mintAddress: 'EthereumTokenMint1',
      chain: 'ethereum',
      liquidity: 50,
      marketCap: 500000,
      ageSeconds: 300,
    },
    // Simulated BSC token
    {
      name: 'BSC_MEME1',
      mintAddress: 'BSCTokenMint1',
      chain: 'bsc',
      liquidity: 30,
      marketCap: 150000,
      ageSeconds: 120,
    },
  ];

  getTokensByChain(chain: string): MultiChainToken[] {
    return this.tokens.filter(token => token.chain.toLowerCase() === chain.toLowerCase());
  }
}
