// src/utils/currency-conversion.util.ts
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
// Example conversion function
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<number> {
  // Call an external API for currency conversion, e.g., ExchangeRatesAPI or similar
  const apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY; // Replace with your API key if necessary
  const apiUrl = `https://openexchangerates.org/api/latest.json`;

  {
    try {
      const response = await axios.get(`${apiUrl}?app_id=${apiKey}`);
      const rates = response.data.rates;

      if (!rates[fromCurrency] || !rates[toCurrency]) {
        throw new HttpException(
          'Currency not supported. Choose another currency',
          HttpStatus.BAD_REQUEST,
        );
      }

      const conversionRate = rates[toCurrency] / rates[fromCurrency];
      return amount * conversionRate;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('Error during currency conversion:', error);
      throw new Error('Currency conversion failed');
    }
  }
}
