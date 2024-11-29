import { ApiProperty } from '@nestjs/swagger';
import { IsCurrencyCode } from 'src/validators/is-currency-code-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Currency code of your new account',
    example: 'JPY',
  })
  @IsCurrencyCode({ message: 'Invalid currency code' })
  currency: string;
}
