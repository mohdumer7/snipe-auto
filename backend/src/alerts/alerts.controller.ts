// src/alerts/alerts.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
@UseGuards(JwtAuthGuard) // Protect endpoints with JWT authentication
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  // Endpoint to create a new alert using validated data from CreateAlertDto
  @Post()
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  // Endpoint to retrieve all alerts for a given user
  @Get(':userWalletAddress')
  async getAlerts(@Param('userWalletAddress') userWalletAddress: string) {
    return this.alertsService.getAlerts(userWalletAddress);
  }

  // Endpoint to simulate checking alerts
  @Get('check/:userWalletAddress')
  async checkAlerts(@Param('userWalletAddress') userWalletAddress: string) {
    return this.alertsService.checkAlerts(userWalletAddress);
  }
}
