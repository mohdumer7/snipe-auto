// src/multi-chain/multi-chain.module.ts
import { Module } from '@nestjs/common';
import { MultiChainService } from './multi-chain.service';
import { MultiChainController } from './multi-chain.controller';

@Module({
  providers: [MultiChainService],
  controllers: [MultiChainController],
  exports: [MultiChainService],
})
export class MultiChainModule {}
