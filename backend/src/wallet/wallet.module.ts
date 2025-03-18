// src/wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { WalletKeyService } from './wallet-key.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [WalletKeyService],
  exports: [WalletKeyService],
})
export class WalletModule {}
