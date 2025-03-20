import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AiSniperService } from './ai-sniper.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAiSniperDto } from './dto/create-ai-sniper.dto';

@Controller('sniper')
@UseGuards(JwtAuthGuard)
export class SniperController {
  constructor(private readonly aiSniperService: AiSniperService) {}

  @Post('create')
  createSniper(@Body() createAiSniperDto: CreateAiSniperDto) {
    return this.aiSniperService.createSniperConfig(createAiSniperDto);
  }

  @Get()
  getSniperConfigs() {
    return this.aiSniperService.getSniperConfigs();
  }
}
