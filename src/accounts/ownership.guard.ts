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
    const authHeader = request.headers['authorization'];

    // Check if the authorization header is present
    if (!authHeader) {
      throw new UnauthorizedException('JWT token is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token format is invalid');
    }

    try {
      // Verify and decode the JWT token
      const decoded = await this.jwtService.verifyAsync(token);
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException(`Invalid token payload ${JSON.stringify(decoded)}`);
      }
      request.user = decoded; // Attach decoded user info to the request

      const accountId = Number(request.params.id); // Parse the account ID from the route parameters
      const account = await this.accountsService.findAccountById(accountId);

      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }

      // Ensure both values are of the same type for comparison
      if (account.userId !== decoded.id) {
        throw new HttpException(
          'Forbidden: You do not own this account',
          HttpStatus.FORBIDDEN,
        );
      }

      return true; // Access granted
    } catch (error) {
      // Log the error for debugging if necessary
      console.error('Error in OwnershipGuard:', error.message);

      throw new UnauthorizedException('You are not an owner of that account');
    }
  }
}
