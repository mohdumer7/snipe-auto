// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChallengeDto } from './dto/challenge.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('challenge')
  async getChallenge(@Body() challengeDto: ChallengeDto) {
    return this.authService.generateChallenge(challengeDto.walletAddress);
  }

  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    const isValid = this.authService.verifySignature(
      verifyDto.challenge,
      verifyDto.signature,
      verifyDto.walletAddress,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }
    return this.authService.login(verifyDto.walletAddress);
  }
}
