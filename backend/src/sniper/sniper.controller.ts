import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { SniperService } from './sniper.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSniperDto } from './dto/create-sniper.dto';

@Controller('sniper')
@UseGuards(JwtAuthGuard)
export class SniperController {
  constructor(private sniperService: SniperService) {}

  @Post('create')
  createSniper(@Body() createSniperDto: CreateSniperDto) {
    return this.sniperService.createSniperConfig(createSniperDto);
  }

  @Get()
  getSniperConfigs() {
    return this.sniperService.getSniperConfigs();
  }
}
