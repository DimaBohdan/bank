import { Module } from '@nestjs/common';
import { DepositTemplateService } from './deposit_template.service';
import { DepositTemplateController } from './deposit_template.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Reflector } from '@nestjs/core/services';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { OwnershipGuard } from 'src/accounts/ownership.guard';
import { IsUserBlockedGuard } from 'src/users/is-user-blocked.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, AccountsModule],
  controllers: [DepositTemplateController],
  providers: [
    DepositTemplateService,
    RolesGuard,
    Reflector,
    JwtStrategy,
    OwnershipGuard,
    IsUserBlockedGuard,
  ],
})
export class DepositTemplateModule {}
