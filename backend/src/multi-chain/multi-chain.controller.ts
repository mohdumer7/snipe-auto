import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MultiChainService } from './multi-chain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('multi-chain')
@UseGuards(JwtAuthGuard)
export class MultiChainController {
  constructor(private multiChainService: MultiChainService) {}

  @Get('tokens')
  async getTokens(@Query('chain') chain: string) {
    if (!chain) {
      return { error: 'Please provide a chain parameter (e.g., ethereum, bsc, solana).' };
    }
    return this.multiChainService.getTokensByChain(chain);
  }
}
