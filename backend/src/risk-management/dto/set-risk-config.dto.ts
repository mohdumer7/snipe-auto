import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SetRiskConfigDto {
  @IsString()
  @IsNotEmpty()
  userWalletAddress: string;

  @IsNumber()
  portfolioStopLoss: number;

  @IsNumber()
  @IsOptional()
  trailingStop?: number;
}
