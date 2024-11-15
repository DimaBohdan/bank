import { Controller, Get, Post, Patch, Body, Param, UseGuards, ParseIntPipe, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({
    description: 'The data to create a new user',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example user creation',
        value: {
          email: 'new@example.com',
          password: 'strongPassword123',
        },
      },
    },
  })
  @Roles('ADMIN')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Block/unblock a user by its ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user you want to block/unblock' })
  @Roles('ADMIN')
  async blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.toggleBlockUser(id);
  }

  @Get(':id/deposits')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Find all deposits of user by id' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user you want to get deposits' })
  async getUserDeposits(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.usersService.findUserDeposits(Number(id));
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get full list of users' })
  async findAllUsers(@Req() req: RequestWithUser) {
    return this.usersService.findAll();
  }
}
