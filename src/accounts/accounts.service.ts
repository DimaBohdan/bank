import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  private readonly apiUrl = 'https://openexchangerates.org/api/latest.json';
  private readonly apiKey = process.env.OPEN_EXCHANGE_RATES_API_KEY;
  constructor(private prisma: PrismaService) {}

  async getAllUserAccounts(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }
  async findAccountById(accountId: number) {
    return this.prisma.account.findUnique({
      where: { id: accountId },
    });
  }

  async create(data: CreateAccountDto) {
    return await this.prisma.account.create({
      data: {
        currency: data.currency,
        userId: data.userId,
      },
    });
  }

  async closeAccount(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: Number(id) },
    });
    if (account.balance !== 0) {
      throw new Error('Account balance must be zero to close it.');
    }
    return this.prisma.account.delete({ where: { id: Number(id) } });
  }

  async getBalance(id: number, currency?: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: Number(id) },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const finalCurrency = currency || account.currency;
    const convertedBalance = await this.convertCurrency(
      account.balance,
      account.currency,
      finalCurrency,
    );
    return { balance: convertedBalance, currency: finalCurrency };
  }

  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    try {
      // Fetch exchange rates
      const response = await axios.get(`${this.apiUrl}?app_id=${this.apiKey}`);
      const rates = response.data.rates;

      // Check if currencies are available
      if (!rates[fromCurrency] || !rates[toCurrency]) {
        throw new HttpException(
          'Currency not supported',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Convert the amount
      const baseAmount = amount / rates[fromCurrency];
      const convertedAmount = baseAmount * rates[toCurrency]; // Convert to target currency
      return convertedAmount;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch exchange rates: ${error}$`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
