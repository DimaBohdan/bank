import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id/block')
  @ApiOperation({ summary: 'Block/unblock a user by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user you want to block/unblock',
  })
  @Roles('ADMIN')
  async blockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleBlockUser(id);
  }

  @Get(':id/deposits')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Find all deposits of user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user you want to get deposits',
  })
  async getUserDeposits(@Param('id') id: string) {
    return this.usersService.findUserDeposits(Number(id));
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get full list of users' })
  async findAllUsers() {
    return this.usersService.findAll();
  }
}
