import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { convertCurrency } from '../utils/currency-conversion.util';
import { IsUserBlockedGuard } from '../users/is-user-blocked.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import your JwtAuthGuard
import { UpdateAccountDto } from './dto/update-account.dto';
import { Request } from 'express';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { OwnershipGuard } from './ownership.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async getUserAccounts(@Req() req: RequestWithUser) {
    const userId = req.user.id; // Assuming `req.user` contains the decoded JWT payload, including `id`
    console.log(req);
    return this.accountsService.getAllUserAccounts(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, IsUserBlockedGuard) // Protect route with JWT and User Blocked Guard
  async createAccount(
    @Body() data: CreateAccountDto,
    @Req() req: RequestWithUser,
  ) {
    // Extract the user from the request, if needed
    const userId = req.user.id;
    return this.accountsService.create({ ...data, userId }); // Associate account with authenticated user
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard) // Only authenticated users can delete an account
  async closeAccount(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.accountsService.closeAccount(id);
  }

  @Get(':id/balance')
  @UseGuards(JwtAuthGuard, OwnershipGuard) // Only authenticated users can access balance
  async getBalance(
    @Param('id', ParseIntPipe) id: number,
    @Query('currency') currency: string,
    @Req() req: RequestWithUser,
  ) {
    return this.accountsService.getBalance(id, currency);
  }

  @Post('convert')
  @UseGuards(JwtAuthGuard) // Only authenticated users can perform currency conversions
  async convertCurrency(
    @Body() body: { amount: number; fromCurrency: string; toCurrency: string },
  ) {
    const { amount, fromCurrency, toCurrency } = body;
    return convertCurrency(amount, fromCurrency, toCurrency);
  }
}
