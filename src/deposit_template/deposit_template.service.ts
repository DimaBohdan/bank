import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepositTemplateDto } from './dto/create-deposit_template.dto';

@Injectable()
export class DepositTemplateService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateDepositTemplateDto) {
    const allowedCurrenciesString = JSON.stringify(dto.allowedCurrencies);

    return this.prisma.depositTemplate.create({
      data: {
        ...dto,
        allowedCurrencies: allowedCurrenciesString,
      },
    });
  }

  async getAll() {
    return this.prisma.depositTemplate.findMany({ where: { isActive: true } });
  }

  async toggleActivateDeposit(id: number) {
    const deposit_template = await this.prisma.depositTemplate.findUnique({
      where: { id },
    });

    if (!deposit_template) {
      throw new Error('Deposit Template not found');
    }

    const newBlockStatus = !deposit_template.isActive;

    return this.prisma.depositTemplate.update({
      where: { id },
      data: { isActive: newBlockStatus },
    });
  }
}
