import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from './accounts.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const user = request.user;
      const accountId = Number(request.params.id);
      const account = await this.accountsService.findAccountById(accountId);

      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }

      if (account.userId !== user.id) {
        throw new HttpException(
          'Forbidden: You do not own this account',
          HttpStatus.FORBIDDEN,
        );
      }

      return true; // Access granted
    } catch (error) {
      console.error('Error in OwnershipGuard:', error.message);

      throw new UnauthorizedException('You are not an owner of that account');
    }
  }
}
