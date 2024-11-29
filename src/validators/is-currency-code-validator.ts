import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { fetchCurrencyCodes } from 'src/utils/currency-api';

export function IsCurrencyCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCurrencyCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async validate(value: any, args: ValidationArguments) {
          try {
            const allowedCurrencies = await fetchCurrencyCodes();
            console.log(typeof value, allowedCurrencies);

            return (
              typeof value === 'string' && allowedCurrencies.includes(value)
            );
          } catch (error) {
            console.error('Error during currency code validation:', error);
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `Currency ${args.value} is not allowed. Please use a valid currency code.`;
        },
      },
    });
  };
}
