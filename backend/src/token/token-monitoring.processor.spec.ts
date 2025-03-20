import { Test, TestingModule } from '@nestjs/testing';
import { TokenMonitoringProcessor } from './token-monitoring.processor';
import { TokenCategorizationService } from './token-categorization.service';
import { RugDetectionService } from './rug-detection.service';
import { LifecycleService } from './lifecycle.service';
import { BluechipService } from './bluechip.service';
import { AiSniperService } from '../sniper/ai-sniper.service';
import { Job } from 'bull';

describe('TokenMonitoringProcessor', () => {
  let processor: TokenMonitoringProcessor;
  let tokenCategorizationService: TokenCategorizationService;
  let rugDetectionService: RugDetectionService;
  let lifecycleService: LifecycleService;
  let bluechipService: BluechipService;
  let aiSniperService: AiSniperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenMonitoringProcessor,
        {
          provide: TokenCategorizationService,
          useValue: {
            categorizeTokenEvent: jest.fn().mockResolvedValue({ mintAddress: 'testMint', name: 'TestToken' }),
          },
        },
        {
          provide: RugDetectionService,
          useValue: {
            analyzeToken: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: LifecycleService,
          useValue: {
            updateTokenLifecycle: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: BluechipService,
          useValue: {
            evaluateBluechip: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AiSniperService,
          useValue: {
            processTokenForSniping: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    processor = module.get<TokenMonitoringProcessor>(TokenMonitoringProcessor);
    tokenCategorizationService = module.get<TokenCategorizationService>(TokenCategorizationService);
    rugDetectionService = module.get<RugDetectionService>(RugDetectionService);
    lifecycleService = module.get<LifecycleService>(LifecycleService);
    bluechipService = module.get<BluechipService>(BluechipService);
    aiSniperService = module.get<AiSniperService>(AiSniperService);
  });

  it('should process a token event and call all sub-services', async () => {
    // Simulated raw token event from, e.g., Pump.fun logs.
    const rawEvent = {
      log: 'Pump.fun NewTokenCreated',
      mintAddress: 'testMint',
      tokenName: 'TestToken',
      timestamp: Date.now(),
      launchProgress: 85, // For lifecycle (e.g., graduating)
      liquidity: 50,
      marketCap: 50000,
      developerWallet: 'DevWalletAddress'
    };

    // Create a fake Bull job
    const job = { id: '1', data: rawEvent } as unknown as Job<any>;

    await processor.handleTokenEvent(job);

    expect(tokenCategorizationService.categorizeTokenEvent).toHaveBeenCalledWith(rawEvent);
    expect(rugDetectionService.analyzeToken).toHaveBeenCalled();
    expect(lifecycleService.updateTokenLifecycle).toHaveBeenCalledWith('testMint', rawEvent.launchProgress);
    expect(bluechipService.evaluateBluechip).toHaveBeenCalledWith('testMint');
    expect(aiSniperService.processTokenForSniping).toHaveBeenCalled();
  });
});
