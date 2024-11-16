import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

@Injectable()
export class IsUserBlockedGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const user = await this.usersService.findOneById(request.user.id);

      if (user?.isBlocked) {
        throw new ForbiddenException(
          'User is blocked and cannot perform this action',
        );
      }

      return true; // User is not blocked, allow access
    } catch (error) {
      // Handle JWT verification errors and other unexpected issues
      throw new UnauthorizedException('Forbidden. User is blocked');
    }
  }
}
