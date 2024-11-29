import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { IsUserBlockedGuard } from '../users/is-user-blocked.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { OwnershipGuard } from 'src/accounts/ownership.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TransferTransactionDto } from './dto/transfer-transaction.dto';
import {
  DepositTransactionDto,
  WithdrawTransactionDto,
} from './dto/deposit-withdraw.dto';

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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the account you want to replenish',
  })
  @ApiBody({
    description: 'The data to create a deposit',
    type: DepositTransactionDto,
  })
  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  async deposit(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DepositTransactionDto,
  ) {
    const { amount } = body;
    const userId = req.user.id;
    console.log(userId);
    return this.transactionService.deposit(userId, id, amount);
  }

  @Post('withdraw/:id')
  @ApiOperation({ summary: 'Withdraw money by accountId' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the account you want to withdraw',
  })
  @ApiBody({
    description: 'The data to withdraw money',
    type: WithdrawTransactionDto,
  })
  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  async withdraw(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WithdrawTransactionDto,
  ) {
    const { amount } = body;
    const userId = req.user.id;
    return this.transactionService.withdraw(userId, id, amount);
  }

  @Post('transfer/:id')
  @ApiOperation({ summary: 'Make a transfer of money to another account' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the account you want to take money from',
  })
  @ApiBody({
    description: 'The data to create a transfer',
    type: TransferTransactionDto,
  })
  @UseGuards(OwnershipGuard, IsUserBlockedGuard)
  async transfer(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) fromAccountId: number,
    @Body()
    body: TransferTransactionDto,
  ) {
    const { toAccountId, amount } = body;
    const userId = req.user.id;
    return this.transactionService.transfer(
      userId,
      fromAccountId,
      toAccountId,
      amount,
    );
  }
}
