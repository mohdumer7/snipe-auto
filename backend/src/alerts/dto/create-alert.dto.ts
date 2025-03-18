// src/alerts/dto/create-alert.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  userWalletAddress: string;

  @IsString()
  @IsNotEmpty()
  alertType: string;

  @IsNumber()
  threshold: number;
}
