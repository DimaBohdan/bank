import { Controller, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get list of all admins' })
  @ApiResponse({ status: 200, description: 'List of admins' })
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Patch('role/:userId/change-role')
  @ApiOperation({ summary: 'Grant admin role to a user' })
  @ApiResponse({ status: 200, description: 'Role granted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async grantAdminRole(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.toggleAdminRole(userId);
  }
}
