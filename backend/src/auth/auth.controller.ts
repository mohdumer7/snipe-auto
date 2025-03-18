// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint to generate a challenge message for the given wallet address
  @Post('challenge')
  async getChallenge(@Body('walletAddress') walletAddress: string) {
    return this.authService.generateChallenge(walletAddress);
  }

  // Endpoint to verify the signature and return a JWT token
  @Post('verify')
  async verify(@Body() payload: { walletAddress: string; signature: string; challenge: string }) {
    const isValid = this.authService.verifySignature(payload.challenge, payload.signature, payload.walletAddress);
    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }
    return this.authService.login(payload.walletAddress);
  }
}
