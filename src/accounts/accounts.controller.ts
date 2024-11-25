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
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { convertCurrency } from '../utils/currency-conversion.util';
import { IsUserBlockedGuard } from '../users/is-user-blocked.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { OwnershipGuard } from './ownership.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all your accounts' })
  async getUserAccounts(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    console.log(req);
    return this.accountsService.getAllUserAccounts(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new account' })
  @ApiBody({
    description: 'The data to create an account',
    examples: {
      example1: {
        summary: 'Example',
        value: {
          currency: 'GBP',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, IsUserBlockedGuard)
  async createAccount(
    @Body() data: CreateAccountDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.accountsService.create({ ...data, userId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing account (if balance is 0)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the account you want to delete',
  })
  @UseGuards(JwtAuthGuard, OwnershipGuard) // Only authenticated users can delete an account
  async closeAccount(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.accountsService.closeAccount(id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get balance of account' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the account you want to get balance',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    description:
      'The optional currency code for the balance conversion (e.g., USD, EUR)',
    example: 'UAH',
  })
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  async getBalance(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Query('currency') currency?: string,
  ) {
    return this.accountsService.getBalance(id, currency);
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert money' })
  @ApiBody({
    description: 'The data to convert money',
    examples: {
      example1: {
        summary: 'Example',
        value: {
          amount: 100,
          fromCurrency: 'EUR',
          toCurrency: 'UAH',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async convertCurrency(
    @Body() body: { amount: number; fromCurrency: string; toCurrency: string },
  ) {
    const { amount, fromCurrency, toCurrency } = body;
    return convertCurrency(amount, fromCurrency, toCurrency);
  }
}
