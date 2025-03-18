// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import nacl from 'tweetnacl';
import { TextEncoder } from 'util';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class AuthService {
  // In-memory storage for challenges; in production, consider a persistent store with expiry.
  private challenges: Map<string, string> = new Map();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // Generate a simple nonce as challenge
  generateChallenge(walletAddress: string): { challenge: string } {
    const nonce = Math.random().toString(36).substring(2);
    this.challenges.set(walletAddress, nonce);
    return { challenge: nonce };
  }

  // Verify that the provided signature correctly signs the challenge using the wallet's public key
  verifySignature(message: string, signature: string, walletAddress: string): boolean {
    try {
      const messageUint8 = new TextEncoder().encode(message);
      const signatureUint8 = Uint8Array.from(Buffer.from(signature, 'base64'));
      const pubKey = new PublicKey(walletAddress);
      return nacl.sign.detached.verify(messageUint8, signatureUint8, pubKey.toBuffer());
    } catch (error) {
      return false;
    }
  }

  // If the signature is valid, delete the challenge, ensure the user exists, and issue a JWT token.
  async login(walletAddress: string): Promise<{ accessToken: string }> {
    this.challenges.delete(walletAddress);
    await this.userService.createUserIfNotExists(walletAddress);
    const payload = { walletAddress };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
