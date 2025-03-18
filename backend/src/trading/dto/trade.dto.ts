import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class TradeDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  tokenMintAddress: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  slippage: number;

  @IsNumber()
  @IsPositive()
  priorityFee: number;
}
