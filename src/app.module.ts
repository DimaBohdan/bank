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

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    DepositsModule,
    AdminModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    Reflector,
  ],
})
export class AppModule {}
