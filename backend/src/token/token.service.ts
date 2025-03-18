// src/token/token.service.ts
import { Injectable } from '@nestjs/common';

export interface Token {
  name: string;
  mintAddress: string;
  source: 'pumpfun' | 'raydium';
  ageSeconds: number;
  liquidity: number;
  marketCap: number;
  flaggedScam?: boolean;
}

@Injectable()
export class TokenService {
  // Simulated token data
  private tokens: Token[] = [
    {
      name: 'MEME1',
      mintAddress: 'TokenMintAddress1',
      source: 'pumpfun',
      ageSeconds: 5,
      liquidity: 3,
      marketCap: 8000,
    },
    {
      name: 'MEME2',
      mintAddress: 'TokenMintAddress2',
      source: 'raydium',
      ageSeconds: 120,
      liquidity: 50,
      marketCap: 150000,
      flaggedScam: true,
    },
    {
      name: 'MEME3',
      mintAddress: 'TokenMintAddress3',
      source: 'pumpfun',
      ageSeconds: 30,
      liquidity: 4,
      marketCap: 10000,
    },
    // Add more simulated tokens as needed...
  ];

  getTokens(category: string): Token[] {
    if (category === 'new') {
      // Return tokens that are very new (age less than 60 seconds)
      return this.tokens.filter(token => token.ageSeconds < 60);
    }
    if (category === 'trending') {
      // Return tokens that are older (age 60 seconds or more)
      return this.tokens.filter(token => token.ageSeconds >= 60);
    }
    // If no category is specified, return all tokens
    return this.tokens;
  }
}
