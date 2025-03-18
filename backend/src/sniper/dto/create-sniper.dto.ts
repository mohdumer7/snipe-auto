import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateSniperDto {
  @IsString()
  @IsNotEmpty()
  userWalletAddress: string;

  @IsNumber()
  minLiquidity: number;

  @IsNumber()
  maxMarketCap: number;

  @IsNumber()
  investmentAmount: number;

  @IsBoolean()
  active: boolean;
}
