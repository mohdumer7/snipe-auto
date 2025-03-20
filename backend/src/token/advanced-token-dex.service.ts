import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TokenCategorizationService } from './token-categorization.service';

@Injectable()
export class AdvancedTokenDexService {
  private readonly logger = new Logger(AdvancedTokenDexService.name);
  private readonly jupiterQuoteUrl: string;
  private readonly jupiterSwapUrl: string;

  constructor(
    private configService: ConfigService,
    private tokenCategorizationService: TokenCategorizationService,
  ) {
    this.jupiterQuoteUrl = this.configService.get<string>('JUPITER_QUOTE_URL') || 'https://quote-api.jup.ag/v4/quote';
    this.jupiterSwapUrl = this.configService.get<string>('JUPITER_SWAP_URL') || 'https://quote-api.jup.ag/v4/swap';
  }

  /**
   * Processes a token event for potential trading via Jupiter.
   */
  async processTokenEvent(rawEvent: any): Promise<any> {
    try {
      this.logger.log(`Processing advanced token event: ${JSON.stringify(rawEvent)}`);
      
      // Use TokenCategorizationService to get the latest token record.
      const token = await this.tokenCategorizationService.categorizeTokenEvent(rawEvent);
      
      // For demonstration, if the token is from Pump.fun and liquidity is low, attempt to get a swap quote.
      if (token.source === 'pumpfun' && token.liquidity < 10) {
        const amountInLamports = Math.floor(0.5 * 1e9); // e.g., 0.5 SOL in lamports
        const quoteParams = {
          inputMint: 'So11111111111111111111111111111111111111112', // WSOL mint
          outputMint: token.mintAddress,
          amount: amountInLamports,
          slippage: 1,
        };
        this.logger.log(`Requesting Jupiter quote with params: ${JSON.stringify(quoteParams)}`);
        const quoteResponse = await axios.get(this.jupiterQuoteUrl, { params: quoteParams, timeout: 5000 });
        if (!quoteResponse.data.data || quoteResponse.data.data.length === 0) {
          throw new Error('No swap routes available from Jupiter.');
        }
        const routes = quoteResponse.data.data;
        // Select route with lowest price impact.
        const bestRoute = routes.reduce((prev, curr) => curr.priceImpactPct < prev.priceImpactPct ? curr : prev, routes[0]);
        this.logger.log(`Selected route: ${JSON.stringify(bestRoute)}`);
        
        const swapPayload = {
          route: bestRoute,
          userPublicKey: rawEvent.userWalletAddress, // Assume raw event contains user's wallet
        };
        this.logger.log(`Requesting swap transaction with payload: ${JSON.stringify(swapPayload)}`);
        const swapResponse = await axios.post(this.jupiterSwapUrl, swapPayload, { timeout: 5000 });
        if (!swapResponse.data || !swapResponse.data.transaction) {
          throw new Error('Failed to get swap transaction from Jupiter.');
        }
        this.logger.log(`Swap transaction obtained for token: ${token.name}`);
        return { token, swapTransaction: swapResponse.data.transaction };
      }
      return token;
    } catch (error) {
      this.logger.error(`Error in AdvancedTokenDexService: ${error.message}`, error.stack);
      throw error;
    }
  }
}
