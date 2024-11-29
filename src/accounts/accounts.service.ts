import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertCurrency } from 'src/utils/currency-conversion.util';

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

  async create(currency: string, userId: number) {
    return await this.prisma.account.create({
      data: {
        currency: currency,
        userId: userId,
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
    await this.prisma.transaction.deleteMany({
      where: { accountId: id },
    });
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
      return convertCurrency(amount, fromCurrency, toCurrency);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch exchange rates: ${error}$`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
