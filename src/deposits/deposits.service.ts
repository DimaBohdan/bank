import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class DepositsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a deposit linked to both a user and an account
  async createDeposit(
    userId: number,
    accountId: number,
    createDepositDto: CreateDepositDto,
  ) {
    // Validate that the account exists and belongs to the user
    const account = await this.prisma.account.findFirst({
      where: {
        id: accountId,
        userId: userId, // Ensures that the account is owned by the user
      },
    });

    if (!account) {
      throw new NotFoundException(
        'Account not found or does not belong to the user',
      );
    }

    // Create the deposit and link it to the account and user
    return this.prisma.deposit.create({
      data: {
        amount: createDepositDto.amount,
        interest: createDepositDto.interest,
        createdAt: new Date(),
        user: {
          connect: { id: account.userId }, // Assumes `userId` exists in the `User` model
        },
        account: {
          connect: { id: accountId }, // Assumes `accountId` exists in the `Account` model
        },
      },
    });
  }

  // Calculate the projected amount for a specific deposit
  async calculateAccountProjections(accountId: number) {
    // Fetch all deposits associated with the provided accountId
    const deposits = await this.prisma.deposit.findMany({
      where: { accountId: accountId },
    });

    // If no deposits are found, throw a NotFoundException
    if (!deposits || deposits.length === 0) {
      throw new NotFoundException(
        'No deposits found for the specified account',
      );
    }

    // Calculate projections for each deposit
    const projections = deposits.map((deposit) => {
      const projectedAmount =
        deposit.amount + deposit.amount * (deposit.interest / 100);
      return { depositId: deposit.id, projectedAmount };
    });

    // Return the projections
    return { accountId, projections };
  }

  // Update the interest rate of a specific deposit
  async updateInterestRate(depositId: number, newInterest: number) {
    return this.prisma.deposit.update({
      where: { id: depositId },
      data: { interest: newInterest },
    });
  }
}
