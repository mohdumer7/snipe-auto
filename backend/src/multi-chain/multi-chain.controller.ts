// src/multi-chain/multi-chain.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MultiChainService } from './multi-chain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('multi-chain')
@UseGuards(JwtAuthGuard)
export class MultiChainController {
  constructor(private multiChainService: MultiChainService) {}

  // Endpoint to retrieve tokens for a specified chain.
  // Example: GET /multi-chain/tokens?chain=ethereum
  @Get('tokens')
  getTokens(@Query('chain') chain: string) {
    if (!chain) {
      return { error: 'Please provide a chain parameter (e.g., ethereum, bsc, solana).' };
    }
    return this.multiChainService.getTokensByChain(chain);
  }
}
