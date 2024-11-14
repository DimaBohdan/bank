import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { UsersModule } from 'src/users/users.module';
import { IsUserBlockedGuard } from 'src/users/is-user-blocked.guard';
import { AuthModule } from 'src/auth/auth.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Reflector } from '@nestjs/core';
import { OwnershipGuard } from 'src/accounts/ownership.guard';

@Module({
  imports: [UsersModule, AuthModule, AccountsModule],
  controllers: [TransactionController],
  providers: [TransactionService, IsUserBlockedGuard, JwtStrategy, Reflector, OwnershipGuard],
})
export class TransactionsModule {}
