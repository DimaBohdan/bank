// src/accounts/accounts.module.ts
import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { AccountsController } from './accounts.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Reflector } from '@nestjs/core';
import { OwnershipGuard } from './ownership.guard';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  providers: [
    AccountsService,
    RolesGuard,
    Reflector,
    JwtStrategy,
    OwnershipGuard,
  ],
  controllers: [AccountsController],
  exports: [AccountsService, OwnershipGuard],
})
export class AccountsModule {}
