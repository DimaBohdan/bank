import { Controller, Post, Get, Patch, Param, Body, Request, UseGuards, Req } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { IsUserBlockedGuard } from '../users/is-user-blocked.guard';
import { OwnershipGuard } from '../accounts/ownership.guard'; // Ensure this guard is properly defined
import { ParseIntPipe } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('deposits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  @Post(':id')
  async createDeposit(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDepositDto: CreateDepositDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id; // Assuming the authenticated user is attached to the request
    return this.depositsService.createDeposit(userId, id, createDepositDto);
  }

  @UseGuards(OwnershipGuard)
  @Get('account/:id/projections')
  async getAccountDepositProjections(
    @Param('id', ParseIntPipe) accountId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.depositsService.calculateAccountProjections(accountId);
  }

  @Patch(':id/interest')
  @Roles('ADMIN')
  async updateInterestRate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { interest: number },
    @Req() req: RequestWithUser,
  ) {
    return this.depositsService.updateInterestRate(id, body.interest);
  }
}
