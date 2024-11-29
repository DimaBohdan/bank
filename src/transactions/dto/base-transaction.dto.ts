import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseTransactionDto {
  @ApiProperty({ description: 'Amount of the transaction', example: 204.63 })
  @IsNumber()
  @IsPositive()
  readonly amount: number;
}
