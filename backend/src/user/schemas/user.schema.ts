// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  walletAddress: string;

  @Prop({ required: true })
  subWalletPublicKey: string;

  @Prop({ required: true })
  subWalletEncryptedPrivateKey: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
