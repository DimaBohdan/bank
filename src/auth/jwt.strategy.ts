import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Use your JWT_SECRET from .env
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOneById(payload.id); // Find user by ID
    if (!user) {
      throw new UnauthorizedException();
    }

    // Attach user with role
    return { ...user, role: payload.role };
  }
}
