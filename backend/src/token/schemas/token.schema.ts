import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true, unique: true })
  mintAddress: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['pumpfun', 'raydium', 'moonshot', 'graduating', 'graduated', 'bluechip', 'unknown'],
    default: 'unknown',
  })
  source: string;

  @Prop()
  creationTime: Date;

  @Prop()
  developerWallet: string;

  @Prop({ type: Number, default: 0 })
  liquidity: number;

  @Prop({ type: Number, default: 0 })
  marketCap: number;

  @Prop({ type: Boolean, default: false })
  rugRisk: boolean;

  @Prop({ type: Boolean, default: false })
  scamPotential: boolean;

  @Prop({ type: Boolean, default: false })
  bluechip: boolean;

  @Prop({ type: Number, default: 0 })
  launchProgress: number; // 0 to 100 for bonding curve progress
}

export const TokenSchema = SchemaFactory.createForClass(Token);
