// src/sniper/sniper.controller.ts
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { SniperService, SniperConfig } from './sniper.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sniper')
@UseGuards(JwtAuthGuard)
export class SniperController {
  constructor(private sniperService: SniperService) {}

  // Endpoint to create a new sniper configuration.
  @Post('create')
  createSniper(@Body() config: SniperConfig): SniperConfig {
    return this.sniperService.createSniperConfig(config);
  }

  // Endpoint to list all sniper configurations.
  @Get()
  getSniperConfigs(): SniperConfig[] {
    return this.sniperService.getSniperConfigs();
  }
}
