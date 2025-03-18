// src/copy-trading/schemas/followed-wallet.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FollowedWalletDocument = FollowedWallet & Document;

@Schema({ timestamps: true })
export class FollowedWallet {
  @Prop({ required: true })
  userWalletAddress: string;

  @Prop({ required: true })
  leaderWalletAddress: string;

  @Prop({ required: true })
  allocation: number;

  @Prop({ default: 1 })
  maxPerTrade: number;

  @Prop({ default: true })
  active: boolean;
}

export const FollowedWalletSchema = SchemaFactory.createForClass(FollowedWallet);
