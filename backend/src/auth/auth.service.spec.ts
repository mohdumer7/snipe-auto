import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('test-token') },
        },
        {
          provide: UserService,
          useValue: { createUserIfNotExists: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should generate a challenge and log in', async () => {
    const walletAddress = 'TestWalletAddress';
    const challenge = service.generateChallenge(walletAddress);
    expect(challenge).toHaveProperty('challenge');

    // Simulate a valid signature (for testing, we assume the verification returns true)
    jest.spyOn(service, 'verifySignature').mockReturnValue(true);
    const loginResult = await service.login(walletAddress);
    expect(loginResult).toHaveProperty('accessToken', 'test-token');
  });
});
