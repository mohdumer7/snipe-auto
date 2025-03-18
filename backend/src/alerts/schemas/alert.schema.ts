// src/alerts/schemas/alert.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema({ timestamps: true })
export class Alert {
  @Prop({ required: true })
  userWalletAddress: string;

  // Type of alert (e.g., 'price', 'volume', 'risk')
  @Prop({ required: true })
  alertType: string;

  // Threshold value for the alert (e.g., price threshold in SOL)
  @Prop({ required: true })
  threshold: number;

  // Whether the alert has been triggered
  @Prop({ default: false })
  triggered: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
