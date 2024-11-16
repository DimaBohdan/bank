import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { IsUserBlockedGuard } from '../users/is-user-blocked.guard';
import { OwnershipGuard } from '../accounts/ownership.guard'; // Ensure this guard is properly defined
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Deposits')
@Controller('deposits')
@UseGuards(RolesGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all deposits across all user accounts' })
  async getUserDeposits(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.depositsService.findAllUserDeposits(userId);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard, IsUserBlockedGuard)
  @Post(':id')
  @ApiOperation({ summary: 'Create a deposit' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the account you want to create deposit',
  })
  @ApiBody({
    description: 'The data to create a deposit',
    type: CreateDepositDto,
    examples: {
      example1: {
        summary: 'Example deposit creation',
        value: {
          amount: 1045.68,
          templateId: 2,
        },
      },
    },
  })
  async createDeposit(
    @Param('id', ParseIntPipe) accountId: number,
    @Body() createDepositDto: CreateDepositDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.depositsService.createDeposit(
      userId,
      accountId,
      createDepositDto,
    );
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Get('account/:id/projections')
  @ApiOperation({ summary: 'Find projections of deposit in account' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the account',
  })
  @ApiQuery({
    name: 'relativeDuration',
    required: false,
    description: 'The optional relative duration',
    example: '2.2',
  })
  async getAccountDepositProjections(
    @Param('id', ParseIntPipe) accountId: number,
    @Query('relativeDuration') relativeDuration?: number,
  ) {
    return this.depositsService.calculateAccountProjections(
      accountId,
      relativeDuration,
    );
  }

  @Patch(':id/interest')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Change an interest of deposit' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the deposit',
  })
  @ApiBody({
    description: 'The data to change a deposit',
    examples: {
      example1: {
        summary: 'Example',
        value: {
          interest: 2.8,
        },
      },
    },
  })
  async updateInterestRate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { interest: number },
  ) {
    return this.depositsService.updateInterestRate(id, body.interest);
  }
}
