import { Test, TestingModule } from '@nestjs/testing';
import { TradingService } from './trading.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Trade } from './schemas/trade.schema';
import { WalletKeyService } from '../wallet/wallet-key.service';
import axios from 'axios';

// Create a mock model for Trade
const mockTradeModel = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([]),
  }),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('TradingService', () => {
  let tradingService: TradingService;
  let walletKeyService: WalletKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradingService,
        {
          provide: getModelToken(Trade.name),
          useValue: mockTradeModel,
        },
        {
          provide: NotificationsGateway,
          useValue: { notifyTradeUpdate: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const config = {
                RPC_PROVIDER_URL: 'https://api.devnet.solana.com',
              };
              return config[key];
            },
          },
        },
        {
          provide: WalletKeyService,
          useValue: {
            getUserKeypair: jest.fn().mockResolvedValue({
              publicKey: { toBase58: () => 'FakePublicKey' },
              // Simulate a Keypair with a partialSign method and serialize method
              partialSign: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    tradingService = module.get<TradingService>(TradingService);
    walletKeyService = module.get<WalletKeyService>(WalletKeyService);

    // Mock axios calls for Jupiter quote and swap endpoints
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: [
          { priceImpactPct: 0.5, /* other route info */ },
        ],
      },
    });

    jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        transaction: Buffer.from('fake_transaction').toString('base64'),
      },
    });

    // Override connection.sendRawTransaction to simulate transaction submission
    tradingService['connection'].sendRawTransaction = jest.fn().mockResolvedValue('fake_signature');
    tradingService['connection'].getSignatureStatus = jest.fn().mockResolvedValue({
      value: { err: null },
    });
  });

  it('should process a buy order successfully', async () => {
    const result = await tradingService.buyToken(
      'TestWalletAddress',
      'TestTokenMint',
      1,     // amount in SOL
      1,     // 1% slippage
      0.001, // priority fee placeholder
    );

    expect(result).toHaveProperty('signature', 'fake_signature');
    expect(result).toHaveProperty('confirmation', true);
  });
});
