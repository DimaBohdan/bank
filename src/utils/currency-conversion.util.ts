import { HttpException, HttpStatus } from '@nestjs/common';
import { fetchCurrenciesRates } from './currency-api';

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<number> {
  try {
    const rates = await fetchCurrenciesRates(); // Ensure we await the async call

    if (!rates[fromCurrency] || !rates[toCurrency]) {
      throw new HttpException(
        'Currency not supported. Choose another currency',
        HttpStatus.BAD_REQUEST,
      );
    }

    const conversionRate = rates[toCurrency] / rates[fromCurrency];
    return amount * conversionRate;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw new HttpException(
      'Failed to convert currency',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
