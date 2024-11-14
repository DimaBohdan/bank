import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { convertCurrency } from '../utils/currency-conversion.util';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}
  async getUserTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: { account: { userId } },
      orderBy: { createdAt: 'desc' }, // Sort by newest first
    });
  }

  async deposit(userId: number, accountId: number, amount: number) {
    // Fetch the account
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { user: true },
    });

    if (!account) {
      console.log(account, userId);
      throw new HttpException('Account not found', HttpStatus.FORBIDDEN);
    }

    // Update account balance
    const updatedAccount = await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });

    // Create transaction record
    await this.prisma.transaction.create({
      data: {
        type: 'deposit',
        amount: amount,
        accountId: accountId,
      },
    });

    return updatedAccount;
  }

  async withdraw(userId: number, accountId: number, amount: number) {
    // Fetch the account
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { user: true },
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.FORBIDDEN);
    }

    if (account.balance < amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    // Deduct balance
    const updatedAccount = await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });

    // Create transaction record
    await this.prisma.transaction.create({
      data: {
        type: 'withdrawal',
        amount: amount,
        accountId: accountId,
      },
    });

    return updatedAccount;
  }

  async transfer(
    userId: number,
    fromAccountId: number,
    toAccountId: number,
    amount: number,
  ) {
    // Fetch source and target accounts
    const fromAccount = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
      include: { user: true },
    });

    const toAccount = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!fromAccount) {
      throw new HttpException('Source account not found', HttpStatus.FORBIDDEN);
    }

    if (!toAccount) {
      throw new HttpException('Target account not found', HttpStatus.NOT_FOUND);
    }

    if (fromAccount.balance < amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    let convertedAmount = amount;
    if (fromAccount.currency !== toAccount.currency) {
      convertedAmount = await convertCurrency(
        amount,
        fromAccount.currency,
        toAccount.currency,
      );
    }
    const updatedAccount = await this.prisma.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } },
    });

    await this.prisma.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: convertedAmount } },
    });

    // Create transaction records
    const transaction = await this.prisma.transaction.create({
      data: {
        type: 'transfer',
        amount: amount,
        accountId: fromAccountId,
        targetAccountId: toAccountId,
      },
    });
    return { ...transaction, ...updatedAccount };
    // Update balances
  }
}
