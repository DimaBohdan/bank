import { IsString, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositTemplateDto {
  @ApiProperty({ description: 'Template name', example: 'High-Interest Savings' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Interest rate', example: 5.5 })
  @IsNumber()
  interest: number;

  @ApiProperty({ description: 'Minimum deposit amount', example: 100 })
  @IsNumber()
  minAmount: number;

  @ApiProperty({ description: 'Maximum deposit amount', example: 10000 })
  @IsNumber()
  maxAmount: number;

  @ApiProperty({
    description: 'Allowed currencies',
    example: ['USD', 'EUR', 'PLN'],
  })
  @IsArray()
  allowedCurrencies: string[];

  @ApiProperty({ description: 'Duration in months', example: 10 })
  @IsNumber()
  durationMonths: number;

  @ApiProperty({ description: 'Whether the template is active', example: true })
  @IsBoolean()
  isActive: boolean;
}
