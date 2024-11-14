import { Controller, Get, Post, Patch, Body, Param, UseGuards, ParseIntPipe, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @Roles('ADMIN')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id/block')
  @Roles('ADMIN')
  async blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.toggleBlockUser(id);
  }

  @Get(':id/deposits')
  @Roles('ADMIN')
  async getUserDeposits(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.usersService.findUserDeposits(Number(id));
  }

  @Get()
  @Roles('ADMIN')
  async findAllUsers(@Req() req: RequestWithUser) {
    return this.usersService.findAll();
  }
}
