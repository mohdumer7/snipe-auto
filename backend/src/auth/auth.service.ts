import { Injectable, Logger } from '@nestjs/common';
import * as nacl from 'tweetnacl';
import { TextEncoder } from 'util';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private challenges: Map<string, string> = new Map();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const network = this.configService.get<string>('SOLANA_NETWORK');
    this.logger.log(`AuthService running on network: ${network}`);
  }

  generateChallenge(walletAddress: string): { challenge: string } {
    const nonce = Math.random().toString(36).substring(2);
    this.challenges.set(walletAddress, nonce);
    this.logger.log(`Generated challenge for wallet ${walletAddress}: ${nonce}`);
    return { challenge: nonce };
  }

  verifySignature(message: string, signature: string, walletAddress: string): boolean {
    try {
      const messageUint8 = new TextEncoder().encode(message);
      const signatureUint8 = Uint8Array.from(Buffer.from(signature, 'base64'));
      const pubKey = new PublicKey(walletAddress);
      const result = nacl.sign.detached.verify(messageUint8, signatureUint8, pubKey.toBuffer());
      this.logger.log(`Signature verification for wallet ${walletAddress}: ${result}`);
      return result;
    } catch (error) {
      this.logger.error(`Error verifying signature for wallet ${walletAddress}`, error.stack);
      return false;
    }
  }

  async login(walletAddress: string): Promise<{ accessToken: string }> {
    this.challenges.delete(walletAddress);
    this.logger.log(`Logging in wallet ${walletAddress}`);
    await this.userService.createUserIfNotExists(walletAddress);
    const payload = { walletAddress };
    const accessToken = this.jwtService.sign(payload);
    this.logger.log(`Issued JWT for wallet ${walletAddress}`);
    return { accessToken };
  }
}
