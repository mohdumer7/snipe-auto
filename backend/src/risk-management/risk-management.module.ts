// src/risk-management/risk-management.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiskManagementService } from './risk-management.service';
import { RiskManagementController } from './risk-management.controller';
import { RiskManagementConfig, RiskManagementConfigSchema } from './schemas/risk-management.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RiskManagementConfig.name, schema: RiskManagementConfigSchema }]),
  ],
  providers: [RiskManagementService],
  controllers: [RiskManagementController],
  exports: [RiskManagementService],
})
export class RiskManagementModule {}
