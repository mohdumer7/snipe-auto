import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from './schemas/trade.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Connection, Transaction, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WalletKeyService } from '../wallet/wallet-key.service';
import { MetricsService } from 'src/observability/metrics.service';

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);
  private connection: Connection;

  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
    private notificationsGateway: NotificationsGateway,
    private configService: ConfigService,
    private walletKeyService: WalletKeyService, // Now injected
    private metricsService: MetricsService,
  ) {
    const rpcUrl = this.configService.get<string>('RPC_PROVIDER_URL');
    this.logger.log(`Connecting to Solana network via RPC: ${rpcUrl}`);
    //@ts-ignore
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  async buyToken(
    userWalletAddress: string,
    tokenMintAddress: string,
    amount: number,       // in SOL
    slippage: number,     // percentage
    priorityFee: number,  // placeholder
  ): Promise<{ signature: string; confirmation: boolean }> {
    this.logger.log(`Initiating buy for wallet ${userWalletAddress} on token ${tokenMintAddress}`);
    try {
      // Retrieve the user's sub-wallet securely (assume implemented via WalletKeyService)
      const subWallet: Keypair = await this.getUserSubWallet(userWalletAddress);

      const SOL_MINT = 'So11111111111111111111111111111111111111112';
      const amountInLamports = Math.floor(amount * LAMPORTS_PER_SOL);
      const quoteParams = {
        inputMint: SOL_MINT,
        outputMint: tokenMintAddress,
        amount: amountInLamports,
        slippage,
      };

      this.logger.log(`Requesting Jupiter quote with params: ${JSON.stringify(quoteParams)}`);
      const quoteResponse = await axios.get('https://quote-api.jup.ag/v4/quote', { params: quoteParams, timeout: 5000 });
      if (!quoteResponse.data.data || quoteResponse.data.data.length === 0) {
        throw new Error('No swap routes available from Jupiter.');
      }

      // Select the best route based on a heuristic, for example, minimal price impact:
      const routes = quoteResponse.data.data;
      const bestRoute = routes.reduce((prev, curr) => {
        return (curr.priceImpactPct < prev.priceImpactPct) ? curr : prev;
      }, routes[0]);

      this.logger.log(`Selected route: ${JSON.stringify(bestRoute)}`);

      const swapPayload = {
        route: bestRoute,
        userPublicKey: subWallet.publicKey.toBase58(),
      };

      this.logger.log(`Requesting swap transaction with payload: ${JSON.stringify(swapPayload)}`);
      const swapResponse = await axios.post('https://quote-api.jup.ag/v4/swap', swapPayload, { timeout: 5000 });
      if (!swapResponse.data || !swapResponse.data.transaction) {
        throw new Error('Failed to obtain swap transaction from Jupiter.');
      }
      const txBase64: string = swapResponse.data.transaction;
      const txBuffer = Buffer.from(txBase64, 'base64');
      let transaction = Transaction.from(txBuffer);

      // Sign the transaction with the sub-wallet
      transaction.partialSign(subWallet);
      this.logger.log(`Transaction signed for wallet ${userWalletAddress}`);

      // Send the transaction and confirm it
      const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
        preflightCommitment: 'confirmed',
      });
      this.logger.log(`Transaction submitted with signature: ${signature}`);

      const confirmation = await this.confirmTransaction(signature);
      this.logger.log(`Transaction confirmed: ${confirmation}`);

      // Record trade in DB, send notifications, etc.
      return { signature, confirmation };
    } catch (error) {
      this.logger.error(`Buy token failed for wallet ${userWalletAddress}`, error.stack);
      throw error;
    }
  }

  /**
   * Executes a sell order using Jupiter aggregator to swap token for SOL.
   */
  async sellToken(
    userWalletAddress: string,
    tokenMintAddress: string,
    amount: number,       // in token units (or SOL if selling SOL)
    slippage: number,
    priorityFee: number,
  ): Promise<{ signature: string; confirmation: boolean }> {
    this.logger.log(`Initiating sell order for wallet ${userWalletAddress} on token ${tokenMintAddress}`);
    try {
      const subWallet: Keypair = await this.getUserSubWallet(userWalletAddress);
      // For selling, swap from token to SOL.
      const outputMint = 'So11111111111111111111111111111111111111112'; // SOL mint
      const inputMint = tokenMintAddress;
      const amountInLamports = Math.floor(amount * LAMPORTS_PER_SOL);

      const quoteParams = {
        inputMint,
        outputMint,
        amount: amountInLamports,
        slippage,
      };
      this.logger.log(`Requesting Jupiter quote for sell: ${JSON.stringify(quoteParams)}`);
      const quoteResponse = await axios.get('https://quote-api.jup.ag/v4/quote', { params: quoteParams });
      if (!quoteResponse.data.data || quoteResponse.data.data.length === 0) {
        throw new Error('No swap route available for sell from Jupiter.');
      }
      const route = quoteResponse.data.data[0];
      this.logger.log(`Selected sell route: ${JSON.stringify(route)}`);

      const swapPayload = {
        route,
        userPublicKey: subWallet.publicKey.toBase58(),
      };
      this.logger.log(`Requesting sell swap transaction from Jupiter: ${JSON.stringify(swapPayload)}`);
      const swapResponse = await axios.post('https://quote-api.jup.ag/v4/swap', swapPayload);
      if (!swapResponse.data || !swapResponse.data.transaction) {
        throw new Error('Failed to get swap transaction for sell from Jupiter.');
      }
      const txBase64: string = swapResponse.data.transaction;
      const txBuffer = Buffer.from(txBase64, 'base64');
      let transaction = Transaction.from(txBuffer);
      transaction.partialSign(subWallet);
      this.logger.log(`Sell transaction signed for wallet ${userWalletAddress}`);

      const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
        preflightCommitment: 'confirmed',
      });
      this.logger.log(`Sell transaction submitted, signature: ${signature}`);

      const confirmation = await this.confirmTransaction(signature);
      this.logger.log(`Sell transaction confirmed: ${confirmation}`);

      const tradeRecord = new this.tradeModel({
        userWalletAddress,
        tokenMintAddress,
        type: 'sell',
        amount,
        status: confirmation ? 'completed' : 'failed',
      });
      await tradeRecord.save();
      this.logger.log(`Sell trade record saved for wallet ${userWalletAddress}`);

      this.notificationsGateway.notifyTradeUpdate({
        type: 'sell',
        trade: tradeRecord,
      });

      return { signature, confirmation };
    } catch (error) {
      this.logger.error(`Sell order failed for wallet ${userWalletAddress}`, error.stack);
      throw error;
    }
  }

  /**
   * Aggregates trade records to compute holdings for a user.
   */
  async getHoldings(userWalletAddress: string): Promise<{ tokenMintAddress: string; netAmount: number }[]> {
    this.logger.log(`Fetching holdings for wallet ${userWalletAddress}`);
    try {
      const trades = await this.tradeModel.find({ userWalletAddress }).exec();
      const holdingsMap: Record<string, number> = {};
      trades.forEach(trade => {
        if (!holdingsMap[trade.tokenMintAddress]) {
          holdingsMap[trade.tokenMintAddress] = 0;
        }
        if (trade.type === 'buy') {
          holdingsMap[trade.tokenMintAddress] += trade.amount;
        } else if (trade.type === 'sell') {
          holdingsMap[trade.tokenMintAddress] -= trade.amount;
        }
      });
      const holdings = Object.keys(holdingsMap).map(tokenMintAddress => ({
        tokenMintAddress,
        netAmount: holdingsMap[tokenMintAddress],
      }));
      this.logger.log(`Holdings for wallet ${userWalletAddress}: ${JSON.stringify(holdings)}`);
      return holdings;
    } catch (error) {
      this.logger.error(`Failed to fetch holdings for wallet ${userWalletAddress}`, error.stack);
      throw error;
    }
  }

  /**
   * Confirms a transaction on-chain with exponential backoff.
   */
  private async confirmTransaction(signature: string): Promise<boolean> {
    let attempts = 0;
    const maxAttempts = 5;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const startTime = Date.now();
  
    while (attempts < maxAttempts) {
      const confirmationStatus = await this.connection.getSignatureStatus(signature);
      if (confirmationStatus.value && confirmationStatus.value.err === null) {
        const duration = (Date.now() - startTime) / 1000;
        this.metricsService.recordTransactionConfirmation(duration);
        return true;
      }
      attempts++;
      const waitTime = 1000 * Math.pow(2, attempts);
      this.logger.log(`Waiting ${waitTime}ms for confirmation. Attempt ${attempts}`);
      await delay(waitTime);
    }
    throw new Error(`Transaction ${signature} not confirmed after ${maxAttempts} attempts`);
  }

  /**
   * Securely retrieves the user's sub-wallet.
   * Production: integrate with UserService & KMS/HSM for secure key retrieval.
   */
  private async getUserSubWallet(userWalletAddress: string): Promise<Keypair> {
    this.logger.log(`Retrieving sub-wallet for wallet ${userWalletAddress}`);
    return Keypair.generate(); // Placeholder; replace with secure key retrieval.
  }
}
