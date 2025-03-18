import { Injectable, Logger } from '@nestjs/common';
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
import { Keypair } from '@solana/web3.js';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletKeyService {
  private readonly logger = new Logger(WalletKeyService.name);
  private readonly kmsClient: KMSClient;
  private readonly kmsKeyId: string;

  constructor(private readonly userService: UserService) {
    // Initialize AWS KMS client using region from environment
    this.kmsClient = new KMSClient({ region: process.env.AWS_REGION || 'us-east-1' });
    //@ts-ignore
    this.kmsKeyId = process.env.KMS_KEY_ID;
    if (!this.kmsKeyId) {
      throw new Error('KMS_KEY_ID not set in environment.');
    }
  }

  /**
   * Retrieves and decrypts the user's sub-wallet key using AWS KMS,
   * then returns a Solana Keypair built from the decrypted secret key bytes.
   */
  async getUserKeypair(userWalletAddress: string): Promise<Keypair> {
    this.logger.log(`Retrieving sub-wallet for wallet ${userWalletAddress}`);
    
    // Retrieve the user record using UserService
    const userRecord = await this.userService.getUserByWalletAddress(userWalletAddress);
    if (!userRecord || !userRecord.subWalletEncryptedPrivateKey) {
      throw new Error(`Sub-wallet for wallet ${userWalletAddress} not found`);
    }
    
    // The encrypted private key is stored as a base64 string.
    const encryptedKeyBase64: string = userRecord.subWalletEncryptedPrivateKey;
    
    // Prepare the AWS KMS Decrypt command.
    const command = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedKeyBase64, 'base64'),
      // Optionally, you can include KeyId, though it's often not required for decryption.
      // KeyId: this.kmsKeyId,
    });

    try {
      const response = await this.kmsClient.send(command);
      if (!response.Plaintext) {
        throw new Error(`Decryption returned empty plaintext for wallet ${userWalletAddress}`);
      }
      
      // Convert the plaintext Buffer to a Uint8Array (expected to be 64 bytes for a full Solana secret key)
      const secretKeyBytes = new Uint8Array(response.Plaintext);
      if (secretKeyBytes.length !== 64) {
        this.logger.warn(
          `Decrypted key for wallet ${userWalletAddress} has unexpected length: ${secretKeyBytes.length}`
        );
      }
      this.logger.log(`Successfully decrypted sub-wallet for wallet ${userWalletAddress}`);
      return Keypair.fromSecretKey(secretKeyBytes);
    } catch (error) {
      this.logger.error(`Error decrypting key for wallet ${userWalletAddress}`, error.stack);
      throw error;
    }
  }

  // Optionally, implement an encryption method to encrypt secret keys before saving:
  // async encryptKey(secretKey: Uint8Array): Promise<string> {
  //   // Use AWS KMS EncryptCommand to encrypt the secretKey and return a base64 string.
  // }
}
