import { Controller, Get, Post, Patch, Param, Body, HttpException, HttpStatus, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@ApiBearerAuth()
@ApiTags('Admin') // Group routes in Swagger
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get list of all admins' })
  @ApiResponse({ status: 200, description: 'List of admins' })
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiBody({
    description: 'The data to create an admin',
    examples: {
      example1: {
        summary: 'Example',
        value: {
          email: 'admin@gmail.com',
          password: 'adminPassword123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Patch('role/:userId/change-role')
  @ApiOperation({ summary: 'Grant admin role to a user' })
  @ApiResponse({ status: 200, description: 'Role granted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async grantAdminRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.adminService.toggleAdminRole(userId);
  }
}
