import { PartialType } from '@nestjs/swagger';
import { CreateDepositTemplateDto } from './create-deposit_template.dto';

export class UpdateDepositTemplateDto extends PartialType(CreateDepositTemplateDto) {}
