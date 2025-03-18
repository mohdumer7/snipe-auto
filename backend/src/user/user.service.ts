// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Keypair } from '@solana/web3.js';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

   // Retrieve a user by wallet address.
   async getUserByWalletAddress(walletAddress: string): Promise<User> {
    const user = await this.userModel.findOne({ walletAddress }).exec();
    if (!user) {
      throw new NotFoundException(`User with wallet address ${walletAddress} not found.`);
    }
    return user;
  }

  // Create a new user if one doesn't exist, including generating a sub-wallet.
  async createUserIfNotExists(walletAddress: string): Promise<User> {
    let user = await this.userModel.findOne({ walletAddress }).exec();
    if (!user) {
      // For demonstration, generate a new sub-wallet Keypair.
      // In production, use secure encryption and key management.
      const { Keypair } = require('@solana/web3.js');
      const keypair = Keypair.generate();

      // For demonstration, encrypt using base64 (NOT production-ready).
      const encryptedPrivateKey = Buffer.from(keypair.secretKey).toString('base64');
      
      user = new this.userModel({
        walletAddress,
        subWalletPublicKey: keypair.publicKey.toBase58(),
        subWalletEncryptedPrivateKey: encryptedPrivateKey,
      });
      await user.save();
    }
    return user;
  }

  // Simple encryption function (ensure stronger security measures in production)
  private encrypt(data: Uint8Array): string {
    const iv = crypto.randomBytes(5);
    const cipher = crypto.createCipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY || 'default_secret',iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }
}
