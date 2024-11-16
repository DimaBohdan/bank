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
    const user = request.user;

    try {
      if (!requiredRoles.includes(user.role)) {
        throw new UnauthorizedException('Access denied for your role');
      }

      return true; // Allow access
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Access denied for your role');
    }
  }
}
