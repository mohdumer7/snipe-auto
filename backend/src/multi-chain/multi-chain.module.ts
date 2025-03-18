import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MultiChainService } from './multi-chain.service';
import { SolanaChainService } from './solana-chain.service';
import { EthereumChainService } from './ethereum-chain.service';

@Module({
  imports: [ConfigModule],
  providers: [MultiChainService, SolanaChainService, EthereumChainService],
  exports: [MultiChainService],
})
export class MultiChainModule {}
