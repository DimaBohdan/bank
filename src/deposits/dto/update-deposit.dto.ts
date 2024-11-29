import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositDto } from './create-deposit.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {
  @ApiProperty({ description: 'Deposit interest', example: 2.2 })
  @IsNumber()
  interest: number;
}
