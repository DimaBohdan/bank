// users.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { Reflector } from '@nestjs/core';
import { IsUserBlockedGuard } from './is-user-blocked.guard';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtStrategy, RolesGuard, Reflector, IsUserBlockedGuard],
  exports: [UsersService, IsUserBlockedGuard],
})
export class UsersModule {}
