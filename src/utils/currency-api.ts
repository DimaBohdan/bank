import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

const apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY;
const apiUrl = 'https://openexchangerates.org/api';

export async function fetchCurrencyCodes(): Promise<Array<string>> {
  try {
    const response = await axios.get(`${apiUrl}/currencies.json`);
    const data = response.data;
    const currencyCodes = Object.keys(data);
    return currencyCodes;
  } catch (error) {
    console.error('Error fetching currency codes:', error);
    throw new HttpException(
      'Failed to fetch currency codes',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function fetchCurrenciesRates(): Promise<Record<string, number>> {
  if (!apiKey) {
    throw new HttpException(
      'API key for Open Exchange Rates is missing',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  try {
    const response = await axios.get(`${apiUrl}/latest.json?app_id=${apiKey}`);
    const rates = response.data.rates;
    return rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    throw new HttpException(
      'Failed to fetch currency rates',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
