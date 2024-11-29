import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, role: true, isBlocked: true },
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
