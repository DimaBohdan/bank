import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DepositsModule } from './deposits/deposits.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RolesGuard } from './auth/roles/roles.guard';
import { OwnershipGuard } from './accounts/ownership.guard';
import { LogsModule } from './logs/logs.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DepositTemplateModule } from './deposit_template/deposit_template.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    DepositsModule,
    AdminModule,
    PrismaModule,
    LogsModule,
    DepositTemplateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    Reflector,
  ],
})
export class AppModule {}
