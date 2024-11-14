import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { OwnershipGuard } from 'src/accounts/ownership.guard';
import { IsUserBlockedGuard } from 'src/users/is-user-blocked.guard';

@Module({
  imports: [UsersModule, AuthModule, AccountsModule],
  controllers: [DepositsController],
  providers: [
    DepositsService,
    RolesGuard,
    Reflector,
    JwtStrategy,
    OwnershipGuard,
    IsUserBlockedGuard,
  ],
})
export class DepositsModule {}
