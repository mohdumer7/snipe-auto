import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CopyTradeDocument = CopyTrade & Document;

@Schema({ timestamps: true })
export class CopyTrade {
  @Prop({ required: true })
  userWalletAddress: string;

  @Prop({ required: true })
  leaderWalletAddress: string;

  @Prop({ required: true })
  allocation: number;

  @Prop({ default: 1 })
  maxPerTrade: number;
}

export const CopyTradeSchema = SchemaFactory.createForClass(CopyTrade);
