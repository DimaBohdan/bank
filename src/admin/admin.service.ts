import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, role: true, isBlocked: true },
    });
  }

  async createAdmin(dto: CreateAdminDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        role: 'ADMIN',
      },
    });
  }

  async toggleAdminRole(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }
}
