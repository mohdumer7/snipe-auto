// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
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

  async createUserIfNotExists(walletAddress: string): Promise<User> {
    let user = await this.userModel.findOne({ walletAddress }).exec();
    if (!user) {
      // Generate a new sub-wallet (Solana keypair)
      const keypair = Keypair.generate();
      // Encrypt the secret key (for production, consider a more robust encryption mechanism)
      const encryptedSecretKey = this.encrypt(keypair.secretKey);
      const createdUser = new this.userModel({
        walletAddress,
        subWalletPublicKey: keypair.publicKey.toBase58(),
        subWalletEncryptedPrivateKey: encryptedSecretKey,
      });
      user = await createdUser.save();
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
