import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator'; // Assumes you have a `@Roles` decorator that sets metadata

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      // If no roles are specified, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // Check if the authorization header is present
    if (!authHeader) {
      throw new UnauthorizedException('JWT token is missing');
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"

    try {
      // Verify and decode the token
      const decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded; // Attach the decoded user info to the request

      // Check if the user's role is in the allowed roles
      if (!requiredRoles.includes(decoded.role)) {
        throw new UnauthorizedException('Access denied for your role');
      }

      return true; // Allow access
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Access denied for your role');
    }
  }
}
