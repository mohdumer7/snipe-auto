// src/sentiment/sentiment.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sentiment')
@UseGuards(JwtAuthGuard) // Protect this endpoint if needed
export class SentimentController {
  constructor(private sentimentService: SentimentService) {}

  // Endpoint to get sentiment data for a token. E.g. GET /sentiment?token=MEME1
  @Get()
  getSentiment(@Query('token') token: string) {
    return this.sentimentService.getSentimentForToken(token);
  }
}
