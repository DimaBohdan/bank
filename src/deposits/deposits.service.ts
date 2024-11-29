import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class DepositsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUserDeposits(userId: number) {
    return this.prisma.deposit.findMany({
      where: { userId },
      include: { account: true, deposittemplates: true },
    });
  }

  async createDeposit(
    userId: number,
    accountId: number,
    dto: CreateDepositDto,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    if (account.userId !== userId) {
      throw new BadRequestException('Unauthorized access to account');
    }

    const template = await this.prisma.depositTemplate.findUnique({
      where: { id: dto.templateId },
    });
    if (!template) {
      throw new BadRequestException('Template not found');
    }

    if (!JSON.parse(template.allowedCurrencies).includes(account.currency)) {
      throw new BadRequestException('Currency not allowed for this template');
    }

    if (dto.amount < template.minAmount || dto.amount > template.maxAmount) {
      throw new BadRequestException('Amount out of allowed range');
    }

    return this.prisma.deposit.create({
      data: {
        amount: dto.amount,
        interest: template.interest,
        accountId,
        userId,
        deposittemplateId: dto.templateId,
      },
    });
  }

  async calculateAccountProjections(
    accountId: number,
    relativeDuration: number,
  ) {
    relativeDuration = relativeDuration || 1;
    const deposits = await this.prisma.deposit.findMany({
      where: { accountId },
    });
    if (!deposits || deposits.length === 0) {
      throw new NotFoundException(
        'No deposits found for the specified account',
      );
    }
    const templates = await Promise.all(
      deposits.map((deposit) =>
        this.prisma.depositTemplate.findUnique({
          where: { id: deposit.deposittemplateId },
        }),
      ),
    );
    const projections = deposits.map((deposit, index) => {
      const template = templates[index];
      if (!template) {
        throw new NotFoundException(
          `Template not found for deposit ID: ${deposit.id}`,
        );
      }
      const projectedAmount =
        deposit.amount +
        deposit.amount *
          ((deposit.interest * relativeDuration * template.durationMonths) /
            12 /
            100);
      return { depositId: deposit.id, projectedAmount };
    });
    return { accountId, projections };
  }

  async updateInterestRate(depositId: number, newInterest: number) {
    if (newInterest <= 0) {
      throw new BadRequestException('Interest rate must be a positive number.');
    }
    const existingDeposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });
    if (!existingDeposit) {
      throw new NotFoundException(`Deposit with ID ${depositId} not found.`);
    }
    const updatedDeposit = await this.prisma.deposit.update({
      where: { id: depositId },
      data: { interest: newInterest },
    });
    return updatedDeposit;
  }
}
