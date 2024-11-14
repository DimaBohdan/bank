import { Controller, Get, Post, Body, Request, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsUserBlockedGuard } from '../users/is-user-blocked.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { OwnershipGuard } from 'src/accounts/ownership.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get('history')
  async getUserTransactionHistory(@Request() req) {
    const userId = req.user.id;
    return this.transactionService.getUserTransactions(userId);
  }

  @Post('deposit/:id')
  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  async deposit(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { amount: number },
  ) {
    const { amount } = body;
    const userId = req.user.id; // Access the user's ID from the request
    console.log(userId);
    return this.transactionService.deposit(userId, id, amount);
  }

  @Post('withdraw/:id')
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
