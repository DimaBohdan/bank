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
    const authHeader = request.headers['authorization'];

    // Check if the authorization header is present
    if (!authHeader) {
      throw new UnauthorizedException('JWT token is missing');
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token format is invalid');
    }

    try {
      // Verify and decode the JWT token
      const decoded = await this.jwtService.verifyAsync(token);
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException(
          `Invalid token payload: ${JSON.stringify(decoded)}`,
        );
      }

      // Attach decoded user info to the request for further use
      const user = await this.usersService.findOneById(decoded.id);

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
