import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({ description: 'Role of user/admin', example: 'USER' })
  @IsString()
  @IsIn(['ADMIN', 'USER'])
  role: string;
}
