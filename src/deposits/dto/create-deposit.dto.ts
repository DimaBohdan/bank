import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositDto {
  @ApiProperty({ description: 'Account ID', example: 1 })
  @IsInt()
  accountId: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Deposit amount', example: 500 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Deposit template ID', example: 1 })
  @IsInt()
  templateId: number;
}
