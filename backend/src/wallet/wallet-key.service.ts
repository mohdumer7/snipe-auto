// src/wallet/wallet-key.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
import { Keypair } from '@solana/web3.js';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletKeyService {
  private readonly logger = new Logger(WalletKeyService.name);
  private readonly kmsClient = new KMSClient({ region: process.env.AWS_REGION || 'us-east-1' });
  // The KMS key ID should be stored in your environment variables.
  private readonly kmsKeyId = process.env.KMS_KEY_ID;

  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves the user's encrypted sub-wallet key from the database, decrypts it via AWS KMS,
   * and returns a Solana Keypair.
   */
  async getUserKeypair(userWalletAddress: string): Promise<Keypair> {
    this.logger.log(`Retrieving sub-wallet for wallet ${userWalletAddress}`);
    // Retrieve the user record (make sure UserService provides this method)
    const userRecord = await this.userService.getUserByWalletAddress(userWalletAddress);
    if (!userRecord || !userRecord.subWalletEncryptedPrivateKey) {
      throw new Error(`Sub-wallet for ${userWalletAddress} not found`);
    }

    const encryptedPrivateKey = userRecord.subWalletEncryptedPrivateKey; // assumed stored as base64 string

    // Create the decrypt command for AWS KMS
    const command = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedPrivateKey, 'base64'),
      KeyId: this.kmsKeyId, // optional: enforce decryption with a specific key
    });

    const response = await this.kmsClient.send(command);
    if (!response.Plaintext) {
      throw new Error(`Failed to decrypt sub-wallet for ${userWalletAddress}`);
    }
    this.logger.log(`Sub-wallet decrypted for wallet ${userWalletAddress}`);
    // Construct a Keypair from the decrypted secret key bytes.
    // Ensure that the decrypted key is the proper length (64 bytes for a full secret key)
    const secretKeyBytes = new Uint8Array(response.Plaintext);
    return Keypair.fromSecretKey(secretKeyBytes);
  }
}
