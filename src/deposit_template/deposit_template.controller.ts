import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DepositTemplateService } from './deposit_template.service';
import { CreateDepositTemplateDto } from './dto/create-deposit_template.dto';
import { DepositTemplate } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('Deposit Templates')
@UseGuards(RolesGuard)
@Controller('deposit-templates')
export class DepositTemplateController {
  constructor(private readonly templateService: DepositTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deposit template' })
  @ApiResponse({
    status: 201,
    description: 'Template created',
  })
  @Roles('ADMIN')
  async createTemplate(
    @Body() dto: CreateDepositTemplateDto,
  ): Promise<DepositTemplate> {
    return this.templateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active deposit templates' })
  @ApiResponse({
    status: 200,
    description: 'List of templates',
  })
  async getAllTemplates(): Promise<DepositTemplate[]> {
    return this.templateService.getAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Active/inactive deposit template' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the template you want ',
  })
  @Roles('ADMIN')
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepositTemplate> {
    return this.templateService.toggleActivateDeposit(id);
  }
}
