import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BaseTransactionDto } from './base-transaction.dto';

export class TransferTransactionDto extends BaseTransactionDto {
  @ApiProperty({
    description: 'Target account ID for transfer',
    example: 2,
  })
  @IsNumber()
  readonly toAccountId: number;
}
