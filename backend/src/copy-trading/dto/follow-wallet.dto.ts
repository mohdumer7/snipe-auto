import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class FollowWalletDto {
  @IsString()
  @IsNotEmpty()
  userWalletAddress: string;

  @IsString()
  @IsNotEmpty()
  leaderWalletAddress: string;

  @IsNumber()
  @IsPositive()
  allocation: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  maxPerTrade?: number;
}
