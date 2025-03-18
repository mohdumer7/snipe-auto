// src/token/token.module.ts
import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],  // Export the TokenService here
})
export class TokenModule {}
