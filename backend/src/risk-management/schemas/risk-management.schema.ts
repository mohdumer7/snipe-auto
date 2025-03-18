// src/risk-management/schemas/risk-management.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RiskManagementConfigDocument = RiskManagementConfig & Document;

@Schema({ timestamps: true })
export class RiskManagementConfig {
  @Prop({ required: true, unique: true })
  userWalletAddress: string;

  // Portfolio stop-loss threshold in percentage (e.g., -30 means if portfolio drops by 30% or more, trigger sell)
  @Prop({ required: true })
  portfolioStopLoss: number;

  // Optional trailing stop percentage (e.g., -15 means if portfolio drops 15% from its peak, trigger sell)
  @Prop({ default: null })
  trailingStop?: number;
}

export const RiskManagementConfigSchema = SchemaFactory.createForClass(RiskManagementConfig);
