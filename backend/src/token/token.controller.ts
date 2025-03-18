// src/token/token.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { TokenService, Token } from './token.service';

@Controller('tokens')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get()
  getTokens(@Query('category') category: string): Token[] {
    return this.tokenService.getTokens(category);
  }
}
