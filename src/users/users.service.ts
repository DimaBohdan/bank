import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        isBlocked: false,
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async toggleBlockUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newBlockStatus = !user.isBlocked;

    return this.prisma.user.update({
      where: { id },
      data: { isBlocked: newBlockStatus },
    });
  }

  async findUserDeposits(userId: number) {
    return this.prisma.deposit.findMany({
      where: { userId },
    });
  }
}
