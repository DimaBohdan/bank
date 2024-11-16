import { Controller, Get, Post, Body, Request, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsUserBlockedGuard } from '../users/is-user-blocked.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { OwnershipGuard } from 'src/accounts/ownership.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(RolesGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('history')
  @ApiOperation({ summary: 'Get history of all transactions' })
  async getUserTransactionHistory(@Request() req) {
    const userId = req.user.id;
    return this.transactionService.getUserTransactions(userId);
  }

  @Post('deposit/:id')
  @ApiOperation({ summary: 'Replenish account by accountId' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the account you want to replenish' })
  @ApiBody({
    description: 'The data to create a deposit',
    examples: {
      example1: {
        summary: 'Example deposit creation',
        value: {
          amount: 204.63,
        },
      },
    },
  })
  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  async deposit(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amount: number },
  ) {
    const { amount } = body;
    const userId = req.user.id;
    console.log(userId);
    return this.transactionService.deposit(userId, id, amount);
  }

  @Post('withdraw/:id')
  @ApiOperation({ summary: 'Withdraw money by accountId' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the account you want to withdraw' })
  @ApiBody({
    description: 'The data to withdraw money',
    examples: {
      example1: {
        summary: 'Example withdraw',
        value: {
          amount: 104.53,
        },
      },
    },
  })
  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  async withdraw(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amount: number },
  ) {
    const { amount } = body;
    const userId = req.user.id; // Access the user's ID from the request
    return this.transactionService.withdraw(userId, id, amount);
  }

  @Post('transfer/:id')
  @ApiOperation({ summary: 'Make a transfer of money to another account' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the account you want to take money from' })
  @ApiBody({
    description: 'The data to create a transfer',
    examples: {
      example1: {
        summary: 'Example transfer creation',
        value: {
          toAccountId: 2,
          amount: 34.63,
        },
      },
    },
  })
  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  async transfer(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) fromAccountId: number,
    @Body()
    body: { toAccountId: number; amount: number },
  ) {
    const { toAccountId, amount } = body;
    const userId = req.user.id; // Access the user's ID from the request
    return this.transactionService.transfer(
      userId,
      fromAccountId,
      toAccountId,
      amount,
    );
  }
}
