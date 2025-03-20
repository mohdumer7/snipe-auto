import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateAiSniperDto {
  @IsString()
  @IsNotEmpty()
  userWalletAddress: string;

  @IsString()
  @IsNotEmpty()
  buySource: 'pumpfun' | 'raydium' | 'moonshot' | 'bluechip' | 'any';

  @IsNumber()
  minLiquidity: number;

  @IsNumber()
  maxMarketCap: number;

  @IsBoolean()
  excludeScam: boolean;

  @IsNumber()
  takeProfit: number; // e.g., 2x

  @IsNumber()
  stopLoss: number; // e.g., -50%

  @IsBoolean()
  trailingStop: boolean;
}
