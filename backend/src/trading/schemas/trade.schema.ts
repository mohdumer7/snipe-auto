// src/trading/schemas/trade.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TradeDocument = Trade & Document;

@Schema({ timestamps: true })
export class Trade {
  @Prop({ required: true })
  userWalletAddress: string;

  @Prop({ required: true })
  tokenMintAddress: string;

  @Prop({ required: true })
  type: string; // 'buy' or 'sell'

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'completed' })
  status: string;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
